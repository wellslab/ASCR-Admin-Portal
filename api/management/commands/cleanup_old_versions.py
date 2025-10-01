from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from api.models import CellLineVersion
import logging

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Archive old cell line versions beyond the retention policy (older than 2 weeks)'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be archived without actually doing it',
        )
        parser.add_argument(
            '--days',
            type=int,
            default=14,
            help='Archive versions older than this many days (default: 14)',
        )
        parser.add_argument(
            '--keep-count',
            type=int,
            default=10,
            help='Keep this many most recent versions per cell line (default: 10)',
        )
    
    def handle(self, *args, **options):
        dry_run = options['dry_run']
        days_threshold = options['days']
        keep_count = options['keep_count']
        
        cutoff_date = timezone.now() - timedelta(days=days_threshold)
        
        self.stdout.write(
            self.style.SUCCESS(
                f"Starting version cleanup (dry_run={dry_run}, "
                f"days_threshold={days_threshold}, keep_count={keep_count})"
            )
        )
        
        # Get all cell lines that have versions
        from api.models import CellLineTemplate
        cell_lines_with_versions = CellLineTemplate.objects.filter(
            versions__isnull=False
        ).distinct()
        
        total_archived = 0
        total_cell_lines_processed = 0
        
        for cell_line in cell_lines_with_versions:
            total_cell_lines_processed += 1
            
            # Get active versions for this cell line ordered by version number (newest first)
            active_versions = cell_line.versions.filter(
                is_archived=False
            ).order_by('-version_number')
            
            # Keep the most recent versions based on keep_count
            versions_to_keep = active_versions[:keep_count]
            keep_ids = [v.id for v in versions_to_keep]
            
            # Find old versions to archive (beyond keep_count AND older than cutoff_date)
            versions_to_archive = cell_line.versions.filter(
                is_archived=False,
                created_on__lt=cutoff_date
            ).exclude(id__in=keep_ids)
            
            archive_count = versions_to_archive.count()
            
            if archive_count > 0:
                self.stdout.write(
                    f"Cell line {cell_line.CellLine_hpscreg_id}: "
                    f"{archive_count} versions to archive"
                )
                
                if not dry_run:
                    # Actually archive the versions
                    versions_to_archive.update(is_archived=True)
                    logger.info(
                        f"Archived {archive_count} versions for "
                        f"cell line {cell_line.CellLine_hpscreg_id}"
                    )
                
                total_archived += archive_count
            
        if dry_run:
            self.stdout.write(
                self.style.WARNING(
                    f"DRY RUN: Would archive {total_archived} versions "
                    f"across {total_cell_lines_processed} cell lines"
                )
            )
        else:
            self.stdout.write(
                self.style.SUCCESS(
                    f"Successfully archived {total_archived} versions "
                    f"across {total_cell_lines_processed} cell lines"
                )
            )
            
        # Show summary statistics
        total_versions = CellLineVersion.objects.count()
        active_versions = CellLineVersion.objects.filter(is_archived=False).count()
        archived_versions = CellLineVersion.objects.filter(is_archived=True).count()
        
        self.stdout.write("\n" + "="*50)
        self.stdout.write("SUMMARY STATISTICS:")
        self.stdout.write(f"Total versions in database: {total_versions}")
        self.stdout.write(f"Active versions: {active_versions}")
        self.stdout.write(f"Archived versions: {archived_versions}")
        self.stdout.write("="*50) 