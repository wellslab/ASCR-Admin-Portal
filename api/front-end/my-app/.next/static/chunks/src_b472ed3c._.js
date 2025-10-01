(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/app/tools/curation/components/ArticlesTable.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "ArticlesTable": (()=>ArticlesTable)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ClockIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClockIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/ClockIcon.js [app-client] (ecmascript) <export default as ClockIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ExclamationTriangleIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExclamationTriangleIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/ExclamationTriangleIcon.js [app-client] (ecmascript) <export default as ExclamationTriangleIcon>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function ArticlesTable({ articles, selectedArticles, onSelectionChange, loading, onStartCuration, onErrorClick, onRetryClick, isPolling = false }) {
    _s();
    const [sortConfig, setSortConfig] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        key: 'modified_on',
        direction: 'desc'
    });
    const [retryingArticles, setRetryingArticles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    // Note: Auto-refresh is handled by the parent component's polling hook
    const handleSelectAll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ArticlesTable.useCallback[handleSelectAll]": ()=>{
            if (selectedArticles.length === articles.length) {
                onSelectionChange([]);
            } else {
                const selectableArticles = articles.filter({
                    "ArticlesTable.useCallback[handleSelectAll].selectableArticles": (article)=>article.curation_status !== 'processing'
                }["ArticlesTable.useCallback[handleSelectAll].selectableArticles"]).slice(0, 20).map({
                    "ArticlesTable.useCallback[handleSelectAll].selectableArticles": (article)=>article.id
                }["ArticlesTable.useCallback[handleSelectAll].selectableArticles"]);
                onSelectionChange(selectableArticles);
            }
        }
    }["ArticlesTable.useCallback[handleSelectAll]"], [
        articles,
        selectedArticles,
        onSelectionChange
    ]);
    const handleArticleSelect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ArticlesTable.useCallback[handleArticleSelect]": (articleId)=>{
            const article = articles.find({
                "ArticlesTable.useCallback[handleArticleSelect].article": (a)=>a.id === articleId
            }["ArticlesTable.useCallback[handleArticleSelect].article"]);
            if (article?.curation_status === 'processing') return;
            if (selectedArticles.includes(articleId)) {
                onSelectionChange(selectedArticles.filter({
                    "ArticlesTable.useCallback[handleArticleSelect]": (id)=>id !== articleId
                }["ArticlesTable.useCallback[handleArticleSelect]"]));
            } else if (selectedArticles.length < 20) {
                onSelectionChange([
                    ...selectedArticles,
                    articleId
                ]);
            }
        }
    }["ArticlesTable.useCallback[handleArticleSelect]"], [
        articles,
        selectedArticles,
        onSelectionChange
    ]);
    const handleRetry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ArticlesTable.useCallback[handleRetry]": async (articleId)=>{
            if (!onRetryClick) return;
            setRetryingArticles({
                "ArticlesTable.useCallback[handleRetry]": (prev)=>new Set(prev).add(articleId)
            }["ArticlesTable.useCallback[handleRetry]"]);
            try {
                await onRetryClick(articleId);
            // No need to refresh - polling will handle updates
            } catch (error) {
                console.error('Retry failed:', error);
            } finally{
                setRetryingArticles({
                    "ArticlesTable.useCallback[handleRetry]": (prev)=>{
                        const newSet = new Set(prev);
                        newSet.delete(articleId);
                        return newSet;
                    }
                }["ArticlesTable.useCallback[handleRetry]"]);
            }
        }
    }["ArticlesTable.useCallback[handleRetry]"], [
        onRetryClick
    ]);
    const getStatusIndicator = (article)=>{
        // Show processing icon if article is being retried (optimistic update)
        if (retryingArticles.has(article.id)) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ClockIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClockIcon$3e$__["ClockIcon"], {
                className: "h-4 w-4 text-blue-500 animate-pulse"
            }, void 0, false, {
                fileName: "[project]/src/app/tools/curation/components/ArticlesTable.tsx",
                lineNumber: 97,
                columnNumber: 9
            }, this);
        }
        switch(article.curation_status){
            case 'completed':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "inline-block w-4 h-4 rounded-full bg-green-200"
                }, void 0, false, {
                    fileName: "[project]/src/app/tools/curation/components/ArticlesTable.tsx",
                    lineNumber: 104,
                    columnNumber: 11
                }, this);
            case 'pending':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "inline-block w-4 h-4 rounded-full bg-blue-200"
                }, void 0, false, {
                    fileName: "[project]/src/app/tools/curation/components/ArticlesTable.tsx",
                    lineNumber: 108,
                    columnNumber: 11
                }, this);
            case 'failed':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center space-x-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>onErrorClick?.(article.id),
                            className: "flex items-center hover:bg-red-50 p-1 rounded transition-colors",
                            title: "Click to view error details",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ExclamationTriangleIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExclamationTriangleIcon$3e$__["ExclamationTriangleIcon"], {
                                className: "h-4 w-4 text-red-500"
                            }, void 0, false, {
                                fileName: "[project]/src/app/tools/curation/components/ArticlesTable.tsx",
                                lineNumber: 118,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/tools/curation/components/ArticlesTable.tsx",
                            lineNumber: 113,
                            columnNumber: 13
                        }, this),
                        onRetryClick && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>handleRetry(article.id),
                            disabled: retryingArticles.has(article.id),
                            className: "flex items-center hover:bg-blue-50 p-1 rounded transition-colors disabled:opacity-50",
                            title: "Retry curation",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-blue-600 text-xs font-medium",
                                children: "↻"
                            }, void 0, false, {
                                fileName: "[project]/src/app/tools/curation/components/ArticlesTable.tsx",
                                lineNumber: 127,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/tools/curation/components/ArticlesTable.tsx",
                            lineNumber: 121,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/tools/curation/components/ArticlesTable.tsx",
                    lineNumber: 112,
                    columnNumber: 11
                }, this);
            case 'processing':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ClockIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClockIcon$3e$__["ClockIcon"], {
                    className: "h-4 w-4 text-blue-500 animate-pulse"
                }, void 0, false, {
                    fileName: "[project]/src/app/tools/curation/components/ArticlesTable.tsx",
                    lineNumber: 134,
                    columnNumber: 11
                }, this);
            default:
                return null;
        }
    };
    const formatDate = (dateString)=>{
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };
    const sortedArticles = [
        ...articles
    ].sort((a, b)=>{
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        // Handle null values
        if (aValue === null && bValue === null) return 0;
        if (aValue === null) return sortConfig.direction === 'asc' ? 1 : -1;
        if (bValue === null) return sortConfig.direction === 'asc' ? -1 : 1;
        if (sortConfig.direction === 'asc') {
            return aValue < bValue ? -1 : 1;
        } else {
            return aValue > bValue ? -1 : 1;
        }
    });
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white shadow rounded-lg p-6",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "animate-pulse",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-4 bg-gray-200 rounded w-1/4 mb-4"
                    }, void 0, false, {
                        fileName: "[project]/src/app/tools/curation/components/ArticlesTable.tsx",
                        lineNumber: 169,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-3",
                        children: [
                            ...Array(5)
                        ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-4 bg-gray-200 rounded"
                            }, i, false, {
                                fileName: "[project]/src/app/tools/curation/components/ArticlesTable.tsx",
                                lineNumber: 172,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/tools/curation/components/ArticlesTable.tsx",
                        lineNumber: 170,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/tools/curation/components/ArticlesTable.tsx",
                lineNumber: 168,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/tools/curation/components/ArticlesTable.tsx",
            lineNumber: 167,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-white shadow rounded-lg overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-6 py-4 border-b border-gray-200",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-between items-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center space-x-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-medium text-gray-900",
                                children: "Articles"
                            }, void 0, false, {
                                fileName: "[project]/src/app/tools/curation/components/ArticlesTable.tsx",
                                lineNumber: 185,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/tools/curation/components/ArticlesTable.tsx",
                            lineNumber: 184,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center space-x-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sm text-gray-500",
                                    children: [
                                        selectedArticles.length,
                                        " of ",
                                        articles.length,
                                        " selected",
                                        selectedArticles.length > 0 && ` (max 20)`
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/tools/curation/components/ArticlesTable.tsx",
                                    lineNumber: 188,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: onStartCuration,
                                    disabled: selectedArticles.length === 0 || isPolling,
                                    className: `px-4 py-2 rounded-md text-sm font-medium ${selectedArticles.length > 0 && !isPolling ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`,
                                    children: isPolling ? 'Processing...' : 'Start Curation'
                                }, void 0, false, {
                                    fileName: "[project]/src/app/tools/curation/components/ArticlesTable.tsx",
                                    lineNumber: 192,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/tools/curation/components/ArticlesTable.tsx",
                            lineNumber: 187,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/tools/curation/components/ArticlesTable.tsx",
                    lineNumber: 183,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/tools/curation/components/ArticlesTable.tsx",
                lineNumber: 182,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "overflow-x-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    className: "min-w-full divide-y divide-gray-200",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                            className: "bg-gray-50",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-6 py-2 text-left",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "checkbox",
                                            checked: selectedArticles.length === articles.length && articles.length > 0,
                                            onChange: handleSelectAll,
                                            className: "rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/tools/curation/components/ArticlesTable.tsx",
                                            lineNumber: 212,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/tools/curation/components/ArticlesTable.tsx",
                                        lineNumber: 211,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                        children: "Filename"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/tools/curation/components/ArticlesTable.tsx",
                                        lineNumber: 219,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                        children: "PubMed ID"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/tools/curation/components/ArticlesTable.tsx",
                                        lineNumber: 222,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                        children: "Tokens"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/tools/curation/components/ArticlesTable.tsx",
                                        lineNumber: 225,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                        children: "Created"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/tools/curation/components/ArticlesTable.tsx",
                                        lineNumber: 228,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                        children: "Modified"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/tools/curation/components/ArticlesTable.tsx",
                                        lineNumber: 231,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                        children: "Status"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/tools/curation/components/ArticlesTable.tsx",
                                        lineNumber: 234,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/tools/curation/components/ArticlesTable.tsx",
                                lineNumber: 210,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/tools/curation/components/ArticlesTable.tsx",
                            lineNumber: 209,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            className: "bg-white divide-y divide-gray-200",
                            children: sortedArticles.map((article)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    className: `hover:bg-gray-50 transition-colors ${selectedArticles.includes(article.id) ? 'bg-blue-50' : ''} ${article.curation_status === 'processing' || retryingArticles.has(article.id) ? 'bg-blue-25' : ''}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-2 whitespace-nowrap",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                checked: selectedArticles.includes(article.id),
                                                onChange: ()=>handleArticleSelect(article.id),
                                                disabled: article.curation_status === 'processing' || retryingArticles.has(article.id),
                                                className: "rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/tools/curation/components/ArticlesTable.tsx",
                                                lineNumber: 250,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/tools/curation/components/ArticlesTable.tsx",
                                            lineNumber: 249,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-2 whitespace-nowrap text-sm text-gray-900",
                                            children: article.filename
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/tools/curation/components/ArticlesTable.tsx",
                                            lineNumber: 258,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-2 whitespace-nowrap text-sm text-gray-900",
                                            children: article.pubmed_id || '-'
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/tools/curation/components/ArticlesTable.tsx",
                                            lineNumber: 261,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-2 whitespace-nowrap text-sm text-gray-900",
                                            children: article.approximate_tokens.toLocaleString()
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/tools/curation/components/ArticlesTable.tsx",
                                            lineNumber: 264,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-2 whitespace-nowrap text-sm text-gray-900",
                                            children: formatDate(article.created_on)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/tools/curation/components/ArticlesTable.tsx",
                                            lineNumber: 267,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-2 whitespace-nowrap text-sm text-gray-900",
                                            children: formatDate(article.modified_on)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/tools/curation/components/ArticlesTable.tsx",
                                            lineNumber: 270,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-2 whitespace-nowrap text-sm",
                                            children: getStatusIndicator(article)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/tools/curation/components/ArticlesTable.tsx",
                                            lineNumber: 273,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, article.id, true, {
                                    fileName: "[project]/src/app/tools/curation/components/ArticlesTable.tsx",
                                    lineNumber: 241,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/app/tools/curation/components/ArticlesTable.tsx",
                            lineNumber: 239,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/tools/curation/components/ArticlesTable.tsx",
                    lineNumber: 208,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/tools/curation/components/ArticlesTable.tsx",
                lineNumber: 207,
                columnNumber: 7
            }, this),
            articles.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-6 text-center text-gray-500",
                children: "No articles available for curation."
            }, void 0, false, {
                fileName: "[project]/src/app/tools/curation/components/ArticlesTable.tsx",
                lineNumber: 283,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/tools/curation/components/ArticlesTable.tsx",
        lineNumber: 181,
        columnNumber: 5
    }, this);
}
_s(ArticlesTable, "1mBriq9z4TvzrxKx3ExaX5Nz9O4=");
_c = ArticlesTable;
var _c;
__turbopack_context__.k.register(_c, "ArticlesTable");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/tools/curation/components/ErrorModal.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "ErrorModal": (()=>ErrorModal)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$headlessui$2f$react$2f$dist$2f$components$2f$dialog$2f$dialog$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@headlessui/react/dist/components/dialog/dialog.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$headlessui$2f$react$2f$dist$2f$components$2f$transition$2f$transition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@headlessui/react/dist/components/transition/transition.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$XMarkIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XMarkIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/XMarkIcon.js [app-client] (ecmascript) <export default as XMarkIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ExclamationTriangleIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExclamationTriangleIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/ExclamationTriangleIcon.js [app-client] (ecmascript) <export default as ExclamationTriangleIcon>");
'use client';
;
;
;
;
function ErrorModal({ isOpen, onClose, errorDetails, loading = false }) {
    const categorizeError = (errorMessage)=>{
        const lowerError = errorMessage.toLowerCase();
        if (lowerError.includes('openai') || lowerError.includes('api key') || lowerError.includes('token limit')) {
            return {
                category: 'OpenAI API Error',
                severity: 'high',
                description: 'Issue with OpenAI API integration'
            };
        } else if (lowerError.includes('parsing') || lowerError.includes('json') || lowerError.includes('format')) {
            return {
                category: 'Data Processing Error',
                severity: 'medium',
                description: 'Issue with data parsing or formatting'
            };
        } else if (lowerError.includes('timeout') || lowerError.includes('connection')) {
            return {
                category: 'Network Error',
                severity: 'medium',
                description: 'Network connectivity issue'
            };
        } else {
            return {
                category: 'Application Error',
                severity: 'low',
                description: 'General application error'
            };
        }
    };
    const getSeverityColor = (severity)=>{
        switch(severity){
            case 'high':
                return 'text-red-600 bg-red-50 border-red-200';
            case 'medium':
                return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'low':
                return 'text-blue-600 bg-blue-50 border-blue-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };
    const formatDate = (dateString)=>{
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$headlessui$2f$react$2f$dist$2f$components$2f$transition$2f$transition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Transition"].Root, {
        show: isOpen,
        as: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"],
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$headlessui$2f$react$2f$dist$2f$components$2f$dialog$2f$dialog$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
            as: "div",
            className: "relative z-50",
            onClose: onClose,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$headlessui$2f$react$2f$dist$2f$components$2f$transition$2f$transition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Transition"].Child, {
                    as: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"],
                    enter: "ease-out duration-300",
                    enterFrom: "opacity-0",
                    enterTo: "opacity-100",
                    leave: "ease-in duration-200",
                    leaveFrom: "opacity-100",
                    leaveTo: "opacity-0",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    }, void 0, false, {
                        fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                        lineNumber: 90,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                    lineNumber: 81,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "fixed inset-0 z-10 overflow-y-auto",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$headlessui$2f$react$2f$dist$2f$components$2f$transition$2f$transition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Transition"].Child, {
                            as: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"],
                            enter: "ease-out duration-300",
                            enterFrom: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
                            enterTo: "opacity-100 translate-y-0 sm:scale-100",
                            leave: "ease-in duration-200",
                            leaveFrom: "opacity-100 translate-y-0 sm:scale-100",
                            leaveTo: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$headlessui$2f$react$2f$dist$2f$components$2f$dialog$2f$dialog$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"].Panel, {
                                className: "relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute right-0 top-0 hidden pr-4 pt-4 sm:block",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: "rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                                            onClick: onClose,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "sr-only",
                                                    children: "Close"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                                    lineNumber: 111,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$XMarkIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XMarkIcon$3e$__["XMarkIcon"], {
                                                    className: "h-6 w-6",
                                                    "aria-hidden": "true"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                                    lineNumber: 112,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                            lineNumber: 106,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                        lineNumber: 105,
                                        columnNumber: 17
                                    }, this),
                                    loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-center py-8",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                                lineNumber: 118,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "ml-3 text-gray-600",
                                                children: "Loading error details..."
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                                lineNumber: 119,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                        lineNumber: 117,
                                        columnNumber: 19
                                    }, this) : errorDetails ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ExclamationTriangleIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExclamationTriangleIcon$3e$__["ExclamationTriangleIcon"], {
                                                            className: "h-6 w-6 text-red-600",
                                                            "aria-hidden": "true"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                                            lineNumber: 125,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                                        lineNumber: 124,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$headlessui$2f$react$2f$dist$2f$components$2f$dialog$2f$dialog$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"].Title, {
                                                            as: "h3",
                                                            className: "text-lg font-medium leading-6 text-gray-900",
                                                            children: "Curation Error Details"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                                            lineNumber: 128,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                                        lineNumber: 127,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                                lineNumber: 123,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-6 space-y-6",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-gray-50 rounded-lg p-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                className: "text-sm font-medium text-gray-900 mb-2",
                                                                children: "Article Information"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                                                lineNumber: 137,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dl", {
                                                                className: "grid grid-cols-1 gap-x-4 gap-y-2 text-sm",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                                                className: "font-medium text-gray-500",
                                                                                children: "Article ID:"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                                                                lineNumber: 140,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                                                className: "text-gray-900",
                                                                                children: errorDetails.article_id
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                                                                lineNumber: 141,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                                                        lineNumber: 139,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    errorDetails.filename && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                                                className: "font-medium text-gray-500",
                                                                                children: "Filename:"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                                                                lineNumber: 145,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                                                className: "text-gray-900",
                                                                                children: errorDetails.filename
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                                                                lineNumber: 146,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                                                        lineNumber: 144,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    errorDetails.pubmed_id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                                                className: "font-medium text-gray-500",
                                                                                children: "PubMed ID:"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                                                                lineNumber: 151,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                                                className: "text-gray-900",
                                                                                children: errorDetails.pubmed_id
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                                                                lineNumber: 152,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                                                        lineNumber: 150,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                                                className: "font-medium text-gray-500",
                                                                                children: "Failed At:"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                                                                lineNumber: 156,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                                                className: "text-gray-900",
                                                                                children: formatDate(errorDetails.failed_at)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                                                                lineNumber: 157,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                                                        lineNumber: 155,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                                                lineNumber: 138,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                                        lineNumber: 136,
                                                        columnNumber: 23
                                                    }, this),
                                                    (()=>{
                                                        const errorInfo = categorizeError(errorDetails.error_message);
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: `rounded-lg p-4 border ${getSeverityColor(errorInfo.severity)}`,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                    className: "text-sm font-medium mb-2",
                                                                    children: "Error Category"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                                                    lineNumber: 167,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm font-medium",
                                                                    children: errorInfo.category
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                                                    lineNumber: 168,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm mt-1",
                                                                    children: errorInfo.description
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                                                    lineNumber: 169,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                                            lineNumber: 166,
                                                            columnNumber: 27
                                                        }, this);
                                                    })(),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                className: "text-sm font-medium text-gray-900 mb-2",
                                                                children: "Error Message"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                                                lineNumber: 176,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "bg-red-50 border border-red-200 rounded-lg p-4",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                                                    className: "text-sm text-red-800 whitespace-pre-wrap font-mono",
                                                                    children: errorDetails.error_message
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                                                    lineNumber: 178,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                                                lineNumber: 177,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                                        lineNumber: 175,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-blue-50 border border-blue-200 rounded-lg p-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                className: "text-sm font-medium text-blue-900 mb-2",
                                                                children: "Troubleshooting Tips"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                                                lineNumber: 186,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                                className: "text-sm text-blue-800 space-y-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                        children: "• Check if the article content is properly formatted"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                                                        lineNumber: 188,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                        children: "• Verify that the transcription process completed successfully"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                                                        lineNumber: 189,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                        children: "• Contact support if the error persists"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                                                        lineNumber: 190,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                        children: "• You can retry curation once the issue is resolved"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                                                        lineNumber: 191,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                                                lineNumber: 187,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                                        lineNumber: 185,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                                lineNumber: 134,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-6 flex justify-end space-x-3",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    className: "rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                                                    onClick: onClose,
                                                    children: "Close"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                                    lineNumber: 197,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                                lineNumber: 196,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                        lineNumber: 122,
                                        columnNumber: 19
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center py-8",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-gray-500",
                                            children: "No error details available."
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                            lineNumber: 208,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                        lineNumber: 207,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                                lineNumber: 104,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                            lineNumber: 95,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                        lineNumber: 94,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
                    lineNumber: 93,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
            lineNumber: 80,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/tools/curation/components/ErrorModal.tsx",
        lineNumber: 79,
        columnNumber: 5
    }, this);
}
_c = ErrorModal;
var _c;
__turbopack_context__.k.register(_c, "ErrorModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/tools/editor/components/ErrorBoundary.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "ErrorBoundary": (()=>ErrorBoundary)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
;
class ErrorBoundary extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Component {
    constructor(props){
        super(props);
        this.state = {
            hasError: false
        };
    }
    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error
        };
    }
    componentDidCatch(error, errorInfo) {
        console.error('Editor Error Boundary caught an error:', error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-red-50 border border-red-200 rounded-lg p-6 m-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-shrink-0",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "h-5 w-5 text-red-400",
                                    viewBox: "0 0 20 20",
                                    fill: "currentColor",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        fillRule: "evenodd",
                                        d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",
                                        clipRule: "evenodd"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/tools/editor/components/ErrorBoundary.tsx",
                                        lineNumber: 35,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/tools/editor/components/ErrorBoundary.tsx",
                                    lineNumber: 34,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/tools/editor/components/ErrorBoundary.tsx",
                                lineNumber: 33,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "ml-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-sm font-medium text-red-800",
                                        children: "Editor Error"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/tools/editor/components/ErrorBoundary.tsx",
                                        lineNumber: 39,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-2 text-sm text-red-700",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: "Something went wrong with the cell line editor. Please refresh the page or contact support if the problem persists."
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/tools/editor/components/ErrorBoundary.tsx",
                                                lineNumber: 43,
                                                columnNumber: 17
                                            }, this),
                                            ("TURBOPACK compile-time value", "development") === 'development' && this.state.error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                                                className: "mt-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                                                        className: "cursor-pointer",
                                                        children: "Technical Details"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/tools/editor/components/ErrorBoundary.tsx",
                                                        lineNumber: 46,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                                        className: "mt-2 text-xs bg-red-100 p-2 rounded overflow-x-auto",
                                                        children: this.state.error.stack
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/tools/editor/components/ErrorBoundary.tsx",
                                                        lineNumber: 47,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/tools/editor/components/ErrorBoundary.tsx",
                                                lineNumber: 45,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/tools/editor/components/ErrorBoundary.tsx",
                                        lineNumber: 42,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/tools/editor/components/ErrorBoundary.tsx",
                                lineNumber: 38,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/tools/editor/components/ErrorBoundary.tsx",
                        lineNumber: 32,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>this.setState({
                                    hasError: false
                                }),
                            className: "bg-red-100 hover:bg-red-200 text-red-800 text-sm font-medium py-2 px-4 rounded transition-colors",
                            children: "Try Again"
                        }, void 0, false, {
                            fileName: "[project]/src/app/tools/editor/components/ErrorBoundary.tsx",
                            lineNumber: 56,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/tools/editor/components/ErrorBoundary.tsx",
                        lineNumber: 55,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/tools/editor/components/ErrorBoundary.tsx",
                lineNumber: 31,
                columnNumber: 9
            }, this);
        }
        return this.props.children;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/lib/api.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "API_ENDPOINTS": (()=>API_ENDPOINTS),
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const isDev = ("TURBOPACK compile-time value", "development") === 'development';
const API_BASE_URL = ("TURBOPACK compile-time truthy", 1) ? 'http://localhost:8000' : ("TURBOPACK unreachable", undefined);
const API_ENDPOINTS = {
    // Curation endpoints
    CURATION: {
        BASE: `${API_BASE_URL}/api/curation`,
        ARTICLES: `${API_BASE_URL}/api/curation/articles/`,
        STATUS: `${API_BASE_URL}/api/curation/status/`,
        BULK_CURATE: `${API_BASE_URL}/api/curation/bulk_curate/`,
        ERROR_DETAILS: (articleId)=>`${API_BASE_URL}/api/curation/${articleId}/error_details/`,
        RETRY: (articleId)=>`${API_BASE_URL}/api/curation/${articleId}/retry/`,
        CELLLINES: (articleId)=>`${API_BASE_URL}/api/curation/${articleId}/celllines/`,
        SAVE_CELLLINE: (celllineId)=>`${API_BASE_URL}/api/curation/celllines/${celllineId}/`
    },
    // Editor endpoints (for reference)
    EDITOR: {
        CELLLINES: `${API_BASE_URL}/api/editor/celllines/`,
        CELLLINE: (id)=>`${API_BASE_URL}/api/editor/celllines/${id}/`,
        SCHEMA: `${API_BASE_URL}/api/editor/cellline-schema/`,
        NEW_TEMPLATE: `${API_BASE_URL}/api/editor/celllines/new_template/`,
        VERSIONS: (id)=>`${API_BASE_URL}/api/editor/celllines/${id}/versions/`,
        VERSION: (id, version)=>`${API_BASE_URL}/api/editor/celllines/${id}/versions/${version}/`
    },
    // Transcription endpoints
    TRANSCRIPTION: {
        ARTICLES: `${API_BASE_URL}/api/articles/`,
        CREATE_ARTICLE: `${API_BASE_URL}/api/transcription/create_article/`
    }
};
const __TURBOPACK__default__export__ = API_ENDPOINTS;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/tools/curation/hooks/useStatusPolling.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "useStatusPolling": (()=>useStatusPolling)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
function useStatusPolling(initialArticles, isPolling = false, pollInterval = 3000) {
    _s();
    const [articles, setArticles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialArticles);
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const pollingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const abortControllerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Sync internal articles state when initialArticles changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useStatusPolling.useEffect": ()=>{
            setArticles(initialArticles);
        }
    }["useStatusPolling.useEffect"], [
        initialArticles
    ]);
    const fetchStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useStatusPolling.useCallback[fetchStatus]": async (showLoading = true)=>{
            try {
                if (showLoading) {
                    setLoading(true);
                }
                setError(null);
                // Cancel previous request if still pending
                if (abortControllerRef.current) {
                    abortControllerRef.current.abort();
                }
                abortControllerRef.current = new AbortController();
                const response = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].CURATION.STATUS, {
                    signal: abortControllerRef.current.signal,
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache'
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                const data = await response.json();
                setArticles(data.articles);
                setStatus(data);
            } catch (err) {
                if (err instanceof Error && err.name === 'AbortError') {
                    // Request was cancelled, ignore
                    return;
                }
                setError(err instanceof Error ? err.message : 'Failed to fetch status');
            } finally{
                if (showLoading) {
                    setLoading(false);
                }
            }
        }
    }["useStatusPolling.useCallback[fetchStatus]"], []);
    // Background fetch without loading state for seamless updates
    const fetchStatusSilent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useStatusPolling.useCallback[fetchStatusSilent]": ()=>{
            fetchStatus(false);
        }
    }["useStatusPolling.useCallback[fetchStatusSilent]"], [
        fetchStatus
    ]);
    const startPolling = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useStatusPolling.useCallback[startPolling]": ()=>{
            if (pollingRef.current) {
                clearInterval(pollingRef.current);
            }
            // Initial fetch with loading indicator
            fetchStatus();
            // Start silent polling for seamless updates
            pollingRef.current = setInterval(fetchStatusSilent, pollInterval);
        }
    }["useStatusPolling.useCallback[startPolling]"], [
        fetchStatus,
        fetchStatusSilent,
        pollInterval
    ]);
    const stopPolling = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useStatusPolling.useCallback[stopPolling]": ()=>{
            if (pollingRef.current) {
                clearInterval(pollingRef.current);
                pollingRef.current = null;
            }
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
                abortControllerRef.current = null;
            }
        }
    }["useStatusPolling.useCallback[stopPolling]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useStatusPolling.useEffect": ()=>{
            if (isPolling) {
                startPolling();
            } else {
                stopPolling();
            }
            return ({
                "useStatusPolling.useEffect": ()=>{
                    stopPolling();
                }
            })["useStatusPolling.useEffect"];
        }
    }["useStatusPolling.useEffect"], [
        isPolling,
        startPolling,
        stopPolling
    ]);
    // Manual refresh function with loading indicator
    const refresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useStatusPolling.useCallback[refresh]": ()=>{
            fetchStatus(true);
        }
    }["useStatusPolling.useCallback[refresh]"], [
        fetchStatus
    ]);
    return {
        articles,
        status,
        loading,
        error,
        refresh,
        startPolling,
        stopPolling
    };
}
_s(useStatusPolling, "+wanWEFQ21VijTLj9cL6Pd20Jkc=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/tools/editor/hooks/useCellLineData.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "useCellLineData": (()=>useCellLineData)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function useCellLineData() {
    _s();
    const [cellLines, setCellLines] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedCellLine, setSelectedCellLine] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Fetch list of available cell lines
    const fetchCellLines = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useCellLineData.useCallback[fetchCellLines]": async (curationSource)=>{
            setIsLoading(true);
            setError(null);
            try {
                let allCellLines = [];
                let url = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].EDITOR.CELLLINES;
                // Add curation source filter to URL if provided
                if (curationSource) {
                    url += `?curation_source=${encodeURIComponent(curationSource)}`;
                }
                // Fetch all pages of cell lines
                while(url){
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch cell lines: ${response.statusText}`);
                    }
                    const data = await response.json();
                    // If it's a paginated response
                    if (data.results) {
                        allCellLines = [
                            ...allCellLines,
                            ...data.results
                        ];
                        url = data.next; // Get next page URL
                    } else {
                        // If it's a direct array response
                        allCellLines = data;
                        url = null;
                    }
                }
                setCellLines(allCellLines);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch cell lines');
                console.error('Error fetching cell lines:', err);
            } finally{
                setIsLoading(false);
            }
        }
    }["useCellLineData.useCallback[fetchCellLines]"], []);
    // Fetch specific cell line by ID
    const fetchCellLine = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useCellLineData.useCallback[fetchCellLine]": async (id)=>{
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].EDITOR.CELLLINE(id));
                if (!response.ok) {
                    throw new Error(`Failed to fetch cell line: ${response.statusText}`);
                }
                const responseData = await response.json();
                // Extract the actual cell line data from the response
                const cellLineData = responseData.data || responseData;
                // Ensure the id field is set for the frontend to use
                if (cellLineData && !cellLineData.id && cellLineData.CellLine_hpscreg_id) {
                    cellLineData.id = cellLineData.CellLine_hpscreg_id;
                }
                setSelectedCellLine(cellLineData);
                return cellLineData;
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch cell line');
                console.error('Error fetching cell line:', err);
                return null;
            } finally{
                setIsLoading(false);
            }
        }
    }["useCellLineData.useCallback[fetchCellLine]"], []);
    // Save cell line changes
    const saveCellLine = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useCellLineData.useCallback[saveCellLine]": async (id, data)=>{
            setIsLoading(true);
            // Don't set global error state here - let the component handle save errors
            try {
                // Clean the data before sending - provide defaults for required fields that are empty
                const cleanedData = {
                    ...data
                };
                // Handle required fields that cannot be blank
                const requiredFields = [
                    'CellLine_source_cell_type',
                    'CellLine_source_tissue',
                    'CellLine_source'
                ];
                requiredFields.forEach({
                    "useCellLineData.useCallback[saveCellLine]": (field)=>{
                        if (cleanedData[field] === '' || cleanedData[field] === null || cleanedData[field] === undefined) {
                            cleanedData[field] = 'Unknown'; // Provide a default value
                        }
                    }
                }["useCellLineData.useCallback[saveCellLine]"]);
                const response = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].EDITOR.CELLLINE(id), {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(cleanedData)
                });
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Failed to save cell line: ${response.statusText} - ${errorText}`);
                }
                const responseData = await response.json();
                // Extract the actual cell line data from the enhanced save response
                const cellLineData = responseData.data || responseData;
                // Ensure the id field is set for the frontend to use
                if (cellLineData && !cellLineData.id && cellLineData.CellLine_hpscreg_id) {
                    cellLineData.id = cellLineData.CellLine_hpscreg_id;
                }
                setSelectedCellLine(cellLineData);
                // Return the full response data so components can access version_info, performance, etc.
                return responseData;
            } catch (err) {
                // Don't set error state for save failures - let component handle them
                console.error('Error saving cell line:', err);
                throw err; // Re-throw so component can catch and handle
            } finally{
                setIsLoading(false);
            }
        }
    }["useCellLineData.useCallback[saveCellLine]"], []);
    // Get new template
    const getNewTemplate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useCellLineData.useCallback[getNewTemplate]": async ()=>{
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].EDITOR.NEW_TEMPLATE);
                if (!response.ok) {
                    throw new Error(`Failed to fetch template: ${response.statusText}`);
                }
                const responseData = await response.json();
                // Extract the template data from the response
                const templateData = responseData.template || responseData;
                setSelectedCellLine(templateData);
                return templateData;
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch template');
                console.error('Error fetching template:', err);
                return null;
            } finally{
                setIsLoading(false);
            }
        }
    }["useCellLineData.useCallback[getNewTemplate]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useCellLineData.useEffect": ()=>{
            fetchCellLines();
        }
    }["useCellLineData.useEffect"], [
        fetchCellLines
    ]);
    return {
        cellLines,
        selectedCellLine,
        isLoading,
        error,
        fetchCellLine,
        saveCellLine,
        getNewTemplate,
        refetch: fetchCellLines,
        setSelectedCellLine
    };
}
_s(useCellLineData, "08PIqKp5Chqo5d/9UIFPR3+UdYA=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/tools/editor/hooks/useSchemaData.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "useSchemaData": (()=>useSchemaData)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
function useSchemaData() {
    _s();
    const [schema, setSchema] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const fetchSchema = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSchemaData.useCallback[fetchSchema]": async ()=>{
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch('http://localhost:8000/api/editor/cellline-schema/');
                if (!response.ok) {
                    throw new Error(`Failed to fetch schema: ${response.statusText}`);
                }
                const data = await response.json();
                // Extract the fields from the schema response
                setSchema(data.schema?.fields || data);
                return data;
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch schema');
                console.error('Error fetching schema:', err);
                return null;
            } finally{
                setIsLoading(false);
            }
        }
    }["useSchemaData.useCallback[fetchSchema]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSchemaData.useEffect": ()=>{
            fetchSchema();
        }
    }["useSchemaData.useEffect"], [
        fetchSchema
    ]);
    return {
        schema,
        isLoading,
        error,
        refetch: fetchSchema
    };
}
_s(useSchemaData, "yeF+gOWnIqjzi24rLlM7zuYPYHs=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/tools/editor/components/ModalValueEditor.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>ModalValueEditor)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function ModalValueEditor({ isOpen, fieldName, value, fieldSchema, onSave, onCancel }) {
    _s();
    const [editValue, setEditValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(value?.toString() || '');
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Reset state when modal opens with new value
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ModalValueEditor.useEffect": ()=>{
            if (isOpen) {
                setEditValue(value?.toString() || '');
                setError(null);
            }
        }
    }["ModalValueEditor.useEffect"], [
        isOpen,
        value
    ]);
    // Focus input when modal opens
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ModalValueEditor.useEffect": ()=>{
            if (isOpen && inputRef.current) {
                // Small delay to ensure modal is fully rendered
                const timer = setTimeout({
                    "ModalValueEditor.useEffect.timer": ()=>{
                        if (inputRef.current) {
                            inputRef.current.focus();
                            // Position cursor at the end instead of selecting all text
                            if ('setSelectionRange' in inputRef.current) {
                                const length = inputRef.current.value.length;
                                inputRef.current.setSelectionRange(length, length);
                            }
                        }
                    }
                }["ModalValueEditor.useEffect.timer"], 100);
                return ({
                    "ModalValueEditor.useEffect": ()=>clearTimeout(timer)
                })["ModalValueEditor.useEffect"];
            }
        }
    }["ModalValueEditor.useEffect"], [
        isOpen
    ]);
    // Handle escape key
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ModalValueEditor.useEffect": ()=>{
            if (!isOpen) return;
            const handleEscapeKey = {
                "ModalValueEditor.useEffect.handleEscapeKey": (e)=>{
                    if (e.key === 'Escape') {
                        onCancel();
                    }
                }
            }["ModalValueEditor.useEffect.handleEscapeKey"];
            document.addEventListener('keydown', handleEscapeKey);
            return ({
                "ModalValueEditor.useEffect": ()=>document.removeEventListener('keydown', handleEscapeKey)
            })["ModalValueEditor.useEffect"];
        }
    }["ModalValueEditor.useEffect"], [
        isOpen,
        onCancel
    ]);
    const validateValue = (val)=>{
        if (!fieldSchema) return null;
        if (fieldSchema.required && val.trim() === '') {
            return 'This field is required';
        }
        if (fieldSchema.max_length && val.length > fieldSchema.max_length) {
            return `Maximum length is ${fieldSchema.max_length} characters`;
        }
        if (fieldSchema.type === 'IntegerField') {
            const num = parseInt(val, 10);
            if (isNaN(num)) {
                return 'Must be a valid integer';
            }
        }
        return null;
    };
    const handleSave = ()=>{
        const validationError = validateValue(editValue);
        if (validationError) {
            setError(validationError);
            return;
        }
        let processedValue = editValue;
        // Convert value based on field type
        if (fieldSchema) {
            switch(fieldSchema.type){
                case 'IntegerField':
                    processedValue = parseInt(editValue, 10);
                    break;
                case 'BooleanField':
                    processedValue = editValue === 'true' || editValue === '1';
                    break;
                case 'JSONField':
                    try {
                        processedValue = JSON.parse(editValue);
                    } catch  {
                        setError('Invalid JSON format');
                        return;
                    }
                    break;
                default:
                    processedValue = editValue;
            }
        }
        onSave(processedValue);
    };
    const handleKeyDown = (e)=>{
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSave();
        }
    // Escape is handled by the document listener
    };
    const handleBackdropClick = (e)=>{
        if (e.target === e.currentTarget) {
            onCancel();
        }
    };
    const renderEditor = ()=>{
        if (fieldSchema?.choices && fieldSchema.choices.length > 0) {
            // Select dropdown for choice fields
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                ref: inputRef,
                value: editValue,
                onChange: (e)=>setEditValue(e.target.value),
                onKeyDown: handleKeyDown,
                className: "w-full border border-gray-300 rounded-lg px-4 py-3 text-xs focus:outline-none",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: "",
                        children: "Select..."
                    }, void 0, false, {
                        fileName: "[project]/src/app/tools/editor/components/ModalValueEditor.tsx",
                        lineNumber: 155,
                        columnNumber: 11
                    }, this),
                    fieldSchema.choices.map((choice)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                            value: choice,
                            children: choice
                        }, choice, false, {
                            fileName: "[project]/src/app/tools/editor/components/ModalValueEditor.tsx",
                            lineNumber: 157,
                            columnNumber: 13
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/tools/editor/components/ModalValueEditor.tsx",
                lineNumber: 148,
                columnNumber: 9
            }, this);
        }
        if (fieldSchema?.type === 'BooleanField') {
            // Boolean toggle
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                ref: inputRef,
                value: editValue,
                onChange: (e)=>setEditValue(e.target.value),
                onKeyDown: handleKeyDown,
                className: "w-full border border-gray-300 rounded-lg px-4 py-3 text-xs focus:outline-none",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: "true",
                        children: "True"
                    }, void 0, false, {
                        fileName: "[project]/src/app/tools/editor/components/ModalValueEditor.tsx",
                        lineNumber: 175,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: "false",
                        children: "False"
                    }, void 0, false, {
                        fileName: "[project]/src/app/tools/editor/components/ModalValueEditor.tsx",
                        lineNumber: 176,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/tools/editor/components/ModalValueEditor.tsx",
                lineNumber: 168,
                columnNumber: 9
            }, this);
        }
        if (fieldSchema?.type === 'JSONField' || editValue && editValue.includes('\n')) {
            // Textarea for multiline content
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                ref: inputRef,
                value: editValue,
                onChange: (e)=>setEditValue(e.target.value),
                onKeyDown: handleKeyDown,
                className: "w-full border border-gray-300 rounded-lg px-4 py-3 text-xs focus:outline-none resize-none",
                rows: Math.min(Math.max(editValue.split('\n').length + 1, 5), 12),
                placeholder: "Enter value..."
            }, void 0, false, {
                fileName: "[project]/src/app/tools/editor/components/ModalValueEditor.tsx",
                lineNumber: 184,
                columnNumber: 9
            }, this);
        }
        // Default text input - use textarea for better visibility of long content
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
            ref: inputRef,
            value: editValue,
            onChange: (e)=>setEditValue(e.target.value),
            onKeyDown: handleKeyDown,
            className: "w-full border border-gray-300 rounded-lg px-4 py-3 text-xs focus:outline-none resize-none",
            rows: 3,
            maxLength: fieldSchema?.max_length,
            placeholder: "Enter value..."
        }, void 0, false, {
            fileName: "[project]/src/app/tools/editor/components/ModalValueEditor.tsx",
            lineNumber: 198,
            columnNumber: 7
        }, this);
    };
    if (!isOpen) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 flex items-center justify-center z-50",
        onClick: handleBackdropClick,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white rounded-lg shadow-xl max-w-lg w-full mx-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-6 py-4 border-b border-gray-200",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-lg font-semibold text-gray-900",
                            children: fieldName
                        }, void 0, false, {
                            fileName: "[project]/src/app/tools/editor/components/ModalValueEditor.tsx",
                            lineNumber: 221,
                            columnNumber: 11
                        }, this),
                        fieldSchema?.help_text && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-gray-600 mt-1",
                            children: fieldSchema.help_text
                        }, void 0, false, {
                            fileName: "[project]/src/app/tools/editor/components/ModalValueEditor.tsx",
                            lineNumber: 225,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/tools/editor/components/ModalValueEditor.tsx",
                    lineNumber: 220,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-6 py-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-medium text-gray-700 mb-2",
                                    children: "Value"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/tools/editor/components/ModalValueEditor.tsx",
                                    lineNumber: 233,
                                    columnNumber: 15
                                }, this),
                                renderEditor(),
                                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-2 text-sm text-red-600",
                                    children: error
                                }, void 0, false, {
                                    fileName: "[project]/src/app/tools/editor/components/ModalValueEditor.tsx",
                                    lineNumber: 238,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/tools/editor/components/ModalValueEditor.tsx",
                            lineNumber: 232,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/tools/editor/components/ModalValueEditor.tsx",
                        lineNumber: 231,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/tools/editor/components/ModalValueEditor.tsx",
                    lineNumber: 230,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-xs text-gray-500 text-center",
                        children: [
                            "Press ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                className: "bg-gray-200 px-1 rounded",
                                children: "Enter"
                            }, void 0, false, {
                                fileName: "[project]/src/app/tools/editor/components/ModalValueEditor.tsx",
                                lineNumber: 249,
                                columnNumber: 19
                            }, this),
                            " to save • ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                className: "bg-gray-200 px-1 rounded",
                                children: "Esc"
                            }, void 0, false, {
                                fileName: "[project]/src/app/tools/editor/components/ModalValueEditor.tsx",
                                lineNumber: 249,
                                columnNumber: 83
                            }, this),
                            " to cancel"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/tools/editor/components/ModalValueEditor.tsx",
                        lineNumber: 248,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/tools/editor/components/ModalValueEditor.tsx",
                    lineNumber: 247,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/tools/editor/components/ModalValueEditor.tsx",
            lineNumber: 218,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/tools/editor/components/ModalValueEditor.tsx",
        lineNumber: 214,
        columnNumber: 5
    }, this);
}
_s(ModalValueEditor, "WiwGxOPbwYT+GmuRof7x/miNgA4=");
_c = ModalValueEditor;
var _c;
__turbopack_context__.k.register(_c, "ModalValueEditor");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/tools/editor/components/EditorLine.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>EditorLine)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$components$2f$ModalValueEditor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tools/editor/components/ModalValueEditor.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function EditorLine({ line, schema, isEditing, onToggleCollapse, onStartEdit, onCancelEdit, onUpdateValue, onAddItem }) {
    _s();
    const [hovering, setHovering] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const getFieldSchema = ()=>{
        const fieldName = line.fieldPath[0];
        return schema?.[fieldName] || null;
    };
    const getSyntaxHighlighting = ()=>{
        const fieldSchema = getFieldSchema();
        const value = line.value;
        // Type-based highlighting
        if (fieldSchema?.type === 'BooleanField') {
            return 'text-purple-600 font-medium'; // Purple for booleans
        }
        if (fieldSchema?.type === 'IntegerField') {
            return 'text-orange-600 font-medium'; // Orange for numbers
        }
        if (Array.isArray(value)) {
            return 'text-green-600'; // Green for arrays
        }
        if (typeof value === 'object' && value !== null) {
            return 'text-indigo-600'; // Indigo for objects
        }
        // Default for strings and other types
        return 'text-gray-900';
    };
    const handleValueClick = ()=>{
        if (line.isEditable && !isEditing) {
            onStartEdit();
        }
    };
    const handleCollapseClick = ()=>{
        if (line.isCollapsible) {
            onToggleCollapse();
        }
    };
    const renderLineContent = ()=>{
        const parts = line.displayText.split(': ');
        const fieldPart = parts[0];
        const valuePart = parts.slice(1).join(': ');
        if (line.type === 'array_control') {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center text-green-600 cursor-pointer hover:text-green-800",
                title: "Add new item to array",
                onClick: onAddItem,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: line.displayText
                }, void 0, false, {
                    fileName: "[project]/src/app/tools/editor/components/EditorLine.tsx",
                    lineNumber: 84,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/tools/editor/components/EditorLine.tsx",
                lineNumber: 79,
                columnNumber: 9
            }, this);
        }
        if (line.isCollapsible) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleCollapseClick,
                        className: "mr-2 text-gray-500 hover:text-gray-700 flex-shrink-0",
                        children: line.isCollapsed ? '▶' : '▼'
                    }, void 0, false, {
                        fileName: "[project]/src/app/tools/editor/components/EditorLine.tsx",
                        lineNumber: 92,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-blue-800 font-medium",
                        children: [
                            fieldPart,
                            ":"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/tools/editor/components/EditorLine.tsx",
                        lineNumber: 98,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/tools/editor/components/EditorLine.tsx",
                lineNumber: 91,
                columnNumber: 9
            }, this);
        }
        if (line.isEditable && valuePart !== undefined) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-blue-800 font-medium mr-1",
                        children: [
                            fieldPart,
                            ":"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/tools/editor/components/EditorLine.tsx",
                        lineNumber: 106,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        onClick: handleValueClick,
                        className: `cursor-pointer px-1 rounded border max-w-md truncate inline-block ${hovering ? 'bg-blue-50 border-blue-200 text-blue-900' : 'hover:bg-gray-50 border-transparent'} ${valuePart.trim() === '' ? 'text-gray-400 italic' : getSyntaxHighlighting()}`,
                        onMouseEnter: ()=>setHovering(true),
                        onMouseLeave: ()=>setHovering(false),
                        title: valuePart.trim() === '' ? '(empty)' : valuePart,
                        children: valuePart.trim() === '' ? '(empty)' : valuePart
                    }, void 0, false, {
                        fileName: "[project]/src/app/tools/editor/components/EditorLine.tsx",
                        lineNumber: 107,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$components$2f$ModalValueEditor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        isOpen: isEditing,
                        fieldName: fieldPart,
                        value: line.value,
                        fieldSchema: getFieldSchema(),
                        onSave: (newValue)=>{
                            console.log('🟡 EditorLine onSave called, fieldPath:', line.fieldPath, 'newValue:', newValue);
                            onUpdateValue(line.fieldPath, newValue);
                        },
                        onCancel: onCancelEdit
                    }, void 0, false, {
                        fileName: "[project]/src/app/tools/editor/components/EditorLine.tsx",
                        lineNumber: 124,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/tools/editor/components/EditorLine.tsx",
                lineNumber: 105,
                columnNumber: 9
            }, this);
        }
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "text-gray-800",
            children: line.displayText
        }, void 0, false, {
            fileName: "[project]/src/app/tools/editor/components/EditorLine.tsx",
            lineNumber: 139,
            columnNumber: 12
        }, this);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-12 text-right text-xs text-gray-500 bg-gray-50 border-r border-gray-200 py-1 px-2 select-none",
                children: line.lineNumber
            }, void 0, false, {
                fileName: "[project]/src/app/tools/editor/components/EditorLine.tsx",
                lineNumber: 145,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 py-1 px-3 min-h-[28px] flex items-center hover:bg-gray-50 border-l-2 border-transparent hover:border-blue-200 transition-colors",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        paddingLeft: `${line.indentLevel * 32}px`
                    },
                    children: renderLineContent()
                }, void 0, false, {
                    fileName: "[project]/src/app/tools/editor/components/EditorLine.tsx",
                    lineNumber: 151,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/tools/editor/components/EditorLine.tsx",
                lineNumber: 150,
                columnNumber: 7
            }, this),
            line.validation && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-2",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: `text-sm ${line.validation.type === 'error' ? 'text-red-500' : 'text-yellow-500'}`,
                    title: line.validation.message,
                    children: line.validation.type === 'error' ? '🔴' : '⚠️'
                }, void 0, false, {
                    fileName: "[project]/src/app/tools/editor/components/EditorLine.tsx",
                    lineNumber: 159,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/tools/editor/components/EditorLine.tsx",
                lineNumber: 158,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/tools/editor/components/EditorLine.tsx",
        lineNumber: 143,
        columnNumber: 5
    }, this);
}
_s(EditorLine, "DvhZWjKEALvSroE2UwRKAB+mXG8=");
_c = EditorLine;
var _c;
__turbopack_context__.k.register(_c, "EditorLine");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>CustomCellLineEditor)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$hooks$2f$useCellLineData$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tools/editor/hooks/useCellLineData.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$hooks$2f$useSchemaData$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tools/editor/hooks/useSchemaData.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$components$2f$ErrorBoundary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tools/editor/components/ErrorBoundary.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$components$2f$EditorLine$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tools/editor/components/EditorLine.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
// import EditorLine from './EditorLine';
// Parse JSON data to display lines
function parseDataToLines(data, schema, path = [], indentLevel = 0, globalLineNumber = {
    current: 1
}) {
    const lines = [];
    function addLine(type, fieldPath, displayText, value, isCollapsible = false, isEditable = false, customIndentLevel) {
        const line = {
            lineNumber: globalLineNumber.current++,
            type,
            fieldPath,
            displayText,
            isCollapsible,
            isCollapsed: true,
            isEditable,
            value,
            indentLevel: customIndentLevel !== undefined ? customIndentLevel : indentLevel
        };
        lines.push(line);
        return line;
    }
    if (typeof data === 'object' && data !== null) {
        Object.entries(data).forEach(([key, value])=>{
            const currentPath = [
                ...path,
                key
            ];
            const indent = '  '.repeat(indentLevel);
            const fieldSchema = schema[key];
            if (Array.isArray(value)) {
                // Array field - always expand arrays to show contents (even if empty)
                const arrayLine = addLine('object', currentPath, `${key}`, value, true, false, indentLevel);
                arrayLine.isCollapsed = false; // Always expand arrays to show their contents
                value.forEach((item, index)=>{
                    const itemPath = [
                        ...currentPath,
                        index.toString()
                    ];
                    if (typeof item === 'object' && item !== null) {
                        addLine('array_item', itemPath, `${index}:`, item, true, false, indentLevel + 1);
                        lines.push(...parseDataToLines(item, schema, itemPath, indentLevel + 2, globalLineNumber));
                    } else {
                        addLine('array_item', itemPath, `${index}: ${item}`, item, false, true, indentLevel + 1);
                    }
                });
                // Add control to add new items
                addLine('array_control', [
                    ...currentPath,
                    'add'
                ], `➕ Add Item`, null, false, false, indentLevel + 1);
            } else if (typeof value === 'object' && value !== null) {
                // Nested object
                addLine('object', currentPath, `${key}`, value, true, false, indentLevel);
                lines.push(...parseDataToLines(value, schema, currentPath, indentLevel + 1, globalLineNumber));
            } else {
                // Simple field
                const displayValue = value === null || value === undefined ? '' : String(value);
                addLine('field', currentPath, `${key}: ${displayValue}`, value, false, true, indentLevel);
            }
        });
    }
    return lines;
}
// Helper function to get visible lines (handles collapsing)
function getVisibleLines(lines) {
    const visible = [];
    let skipUntilIndent = -1;
    for(let i = 0; i < lines.length; i++){
        const line = lines[i];
        // If we're skipping and this line is still at a deeper indent level, skip it
        if (skipUntilIndent >= 0 && line.indentLevel > skipUntilIndent) {
            continue;
        }
        // Reset skip mode if we've returned to the parent level or higher
        if (skipUntilIndent >= 0 && line.indentLevel <= skipUntilIndent) {
            skipUntilIndent = -1;
        }
        // Always show the line itself
        visible.push(line);
        // If this line is collapsed, start skipping its children
        if (line.isCollapsed && line.isCollapsible) {
            skipUntilIndent = line.indentLevel;
        }
    }
    return visible;
}
function CustomCellLineEditor({ initialCellLineId, hideSelector = false, onSave, onError } = {}) {
    _s();
    const { cellLines, selectedCellLine, isLoading: cellLineLoading, error: cellLineError, fetchCellLine, saveCellLine, setSelectedCellLine, refetch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$hooks$2f$useCellLineData$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCellLineData"])();
    const { schema, isLoading: schemaLoading, error: schemaError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$hooks$2f$useSchemaData$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSchemaData"])();
    const [selectedCellLineId, setSelectedCellLineId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialCellLineId || '');
    const [displayLines, setDisplayLines] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [editingLine, setEditingLine] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isSaving, setIsSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [saveError, setSaveError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [changeHistory, setChangeHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [canUndo, setCanUndo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [originalCellLine, setOriginalCellLine] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [curationSourceFilter, setCurationSourceFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // Generate display lines when data or schema changes
    const lines = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CustomCellLineEditor.useMemo[lines]": ()=>{
            if (!selectedCellLine || !schema) return [];
            return parseDataToLines(selectedCellLine, schema);
        }
    }["CustomCellLineEditor.useMemo[lines]"], [
        selectedCellLine,
        schema
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CustomCellLineEditor.useEffect": ()=>{
            setDisplayLines(lines);
        }
    }["CustomCellLineEditor.useEffect"], [
        lines
    ]);
    // Define handleCellLineSelect before it's used in useEffect
    const handleCellLineSelect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CustomCellLineEditor.useCallback[handleCellLineSelect]": async (cellLineId)=>{
            if (cellLineId) {
                setSelectedCellLineId(cellLineId);
                setChangeHistory([]);
                setCanUndo(false);
                setOriginalCellLine(null); // Reset original state when switching cell lines
                setSaveError(null); // Clear any previous save errors
                // Find the cell line data from the list or fetch individual one
                const existingCellLine = cellLines.find({
                    "CustomCellLineEditor.useCallback[handleCellLineSelect].existingCellLine": (cl)=>cl.CellLine_hpscreg_id === cellLineId
                }["CustomCellLineEditor.useCallback[handleCellLineSelect].existingCellLine"]);
                if (existingCellLine && schema) {
                    // Convert the flat structure to be compatible with selectedCellLine
                    const cellLineData = {
                        id: existingCellLine.CellLine_hpscreg_id,
                        ...existingCellLine,
                        template_name: existingCellLine.CellLine_hpscreg_id
                    };
                    setSelectedCellLine(cellLineData);
                    setOriginalCellLine(JSON.parse(JSON.stringify(cellLineData))); // Deep copy for original state
                    // Directly use the existing data
                    const lines = parseDataToLines(cellLineData, schema);
                    setDisplayLines(lines);
                } else {
                    await fetchCellLine(cellLineId);
                }
            }
        }
    }["CustomCellLineEditor.useCallback[handleCellLineSelect]"], [
        cellLines,
        schema,
        fetchCellLine,
        setSelectedCellLine
    ]);
    // Refetch cell lines when curation source filter changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CustomCellLineEditor.useEffect": ()=>{
            refetch(curationSourceFilter || undefined);
        }
    }["CustomCellLineEditor.useEffect"], [
        curationSourceFilter,
        refetch
    ]);
    // Auto-select initial cell line when provided and data is ready
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CustomCellLineEditor.useEffect": ()=>{
            if (initialCellLineId && schema) {
                // Always update when initialCellLineId changes, regardless of current selection
                if (!selectedCellLine || selectedCellLine.id !== initialCellLineId) {
                    handleCellLineSelect(initialCellLineId);
                }
            }
        }
    }["CustomCellLineEditor.useEffect"], [
        initialCellLineId,
        schema,
        handleCellLineSelect
    ]);
    // Set original cell line when selectedCellLine changes (but not when it's being updated by edits)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CustomCellLineEditor.useEffect": ()=>{
            if (selectedCellLine && !originalCellLine) {
                setOriginalCellLine(JSON.parse(JSON.stringify(selectedCellLine)));
            }
        }
    }["CustomCellLineEditor.useEffect"], [
        selectedCellLine,
        originalCellLine
    ]);
    const handleSave = async ()=>{
        if (!selectedCellLine) return;
        setIsSaving(true);
        setSaveError(null); // Clear any previous save errors
        try {
            const result = await saveCellLine(selectedCellLine.id, selectedCellLine);
            console.log('✅ Save successful');
            // Call the onSave callback if provided (for curation workflow)
            if (onSave) {
                onSave(result.data || selectedCellLine);
            }
        } catch (error) {
            console.error('❌ Save failed:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to save cell line';
            setSaveError(errorMessage);
            // Call the onError callback if provided
            if (onError) {
                onError(errorMessage);
            }
        } finally{
            setIsSaving(false);
        }
    };
    const dismissSaveError = ()=>{
        setSaveError(null);
    };
    const toggleCollapse = (lineNumber)=>{
        setDisplayLines((prev)=>prev.map((line)=>line.lineNumber === lineNumber ? {
                    ...line,
                    isCollapsed: !line.isCollapsed
                } : line));
    };
    const startEditing = (lineNumber)=>{
        setEditingLine(lineNumber);
    };
    const cancelEditing = ()=>{
        setEditingLine(null);
    };
    const handleUndo = ()=>{
        if (changeHistory.length === 0) return;
        // Get the last state from history
        const lastState = changeHistory[changeHistory.length - 1];
        // Remove the last state from history
        setChangeHistory((prev)=>prev.slice(0, -1));
        setCanUndo(changeHistory.length > 1);
        // Restore the state
        setSelectedCellLine(lastState);
        // Regenerate display lines
        if (schema) {
            const newLines = parseDataToLines(lastState, schema);
            setDisplayLines(newLines);
        }
        console.log('🔄 Undo performed, remaining history items:', changeHistory.length - 1);
    };
    const handleRevertAll = ()=>{
        if (!originalCellLine) return;
        // Restore the original state
        setSelectedCellLine(JSON.parse(JSON.stringify(originalCellLine)));
        // Clear change history
        setChangeHistory([]);
        setCanUndo(false);
        // Regenerate display lines
        if (schema) {
            const newLines = parseDataToLines(originalCellLine, schema);
            setDisplayLines(newLines);
        }
        console.log('🔄 All changes reverted to original state');
    };
    const updateValue = (fieldPath, newValue)=>{
        console.log('🟢 updateValue called with fieldPath:', fieldPath, 'newValue:', newValue);
        console.log('🟢 Current selectedCellLine:', selectedCellLine ? 'EXISTS' : 'NULL');
        console.log('🟢 selectedCellLine keys:', selectedCellLine ? Object.keys(selectedCellLine).slice(0, 5) : 'N/A');
        // Update the selectedCellLine data with proper deep cloning and state update
        if (selectedCellLine) {
            console.log('🟢 selectedCellLine exists, creating deep copy...');
            // Save current state to history before making changes
            setChangeHistory((prev)=>[
                    ...prev,
                    JSON.parse(JSON.stringify(selectedCellLine))
                ]);
            setCanUndo(true);
            // Create a deep copy of the selected cell line
            const updated = JSON.parse(JSON.stringify(selectedCellLine));
            let current = updated;
            console.log('🟢 Navigating to field path...');
            // Navigate to the parent object
            for(let i = 0; i < fieldPath.length - 1; i++){
                if (!current[fieldPath[i]]) {
                    current[fieldPath[i]] = {};
                }
                current = current[fieldPath[i]];
            }
            // Set the new value
            const fieldName = fieldPath[fieldPath.length - 1];
            console.log('🟢 Setting field', fieldName, 'from', current[fieldName], 'to', newValue);
            current[fieldName] = newValue;
            console.log('🟢 Updated object:', updated);
            // UPDATE: Actually update the selectedCellLine state - this was the missing piece!
            console.log('🟢 Calling setSelectedCellLine...');
            setSelectedCellLine(updated);
            // Regenerate display lines with updated data
            if (schema) {
                console.log('🟢 Regenerating display lines...');
                const newLines = parseDataToLines(updated, schema);
                setDisplayLines(newLines);
                console.log('🟢 Display lines updated, count:', newLines.length);
            }
        } else {
            console.log('❌ No selectedCellLine available');
        }
        console.log('🟢 Setting editing line to null');
        setEditingLine(null);
    };
    const createEmptyItemFromSchema = (fieldName)=>{
        const fieldSchema = schema?.[fieldName];
        if (!fieldSchema?.json_schema) {
            // Simple array - add empty string
            return "";
        }
        const jsonSchema = fieldSchema.json_schema;
        // For array items, look at the items schema
        if (jsonSchema.type === 'array' && jsonSchema.items) {
            const itemSchema = jsonSchema.items;
            if (itemSchema.type === 'object' && itemSchema.properties) {
                // Complex array - create object with all fields as empty strings
                const emptyObject = {};
                Object.keys(itemSchema.properties).forEach((prop)=>{
                    emptyObject[prop] = "";
                });
                return emptyObject;
            } else {
                // Simple array item type
                return "";
            }
        }
        // Fallback to empty string
        return "";
    };
    const handleAddItem = (fieldPath)=>{
        if (!selectedCellLine || !schema) return;
        console.log('🟢 handleAddItem called with fieldPath:', fieldPath);
        // Save current state to history before making changes
        setChangeHistory((prev)=>[
                ...prev,
                JSON.parse(JSON.stringify(selectedCellLine))
            ]);
        setCanUndo(true);
        // Remove 'add' from the path to get the actual array field path
        const arrayFieldPath = fieldPath.slice(0, -1);
        const fieldName = arrayFieldPath[0];
        console.log('🟢 Array field name:', fieldName);
        // Create a deep copy of the selected cell line
        const updated = JSON.parse(JSON.stringify(selectedCellLine));
        let current = updated;
        // Navigate to the array
        for(let i = 0; i < arrayFieldPath.length - 1; i++){
            current = current[arrayFieldPath[i]];
        }
        const arrayField = arrayFieldPath[arrayFieldPath.length - 1];
        if (!Array.isArray(current[arrayField])) {
            current[arrayField] = [];
        }
        // Create new item based on schema
        const newItem = createEmptyItemFromSchema(fieldName);
        console.log('🟢 Adding new item:', newItem);
        // Add the new item
        current[arrayField].push(newItem);
        // Update state
        setSelectedCellLine(updated);
        // Regenerate display lines
        const newLines = parseDataToLines(updated, schema);
        setDisplayLines(newLines);
        console.log('🟢 Array item added successfully');
    };
    if (schemaLoading || cellLineLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center h-64",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"
                }, void 0, false, {
                    fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                    lineNumber: 413,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "ml-3 text-gray-600",
                    children: "Loading..."
                }, void 0, false, {
                    fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                    lineNumber: 414,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
            lineNumber: 412,
            columnNumber: 7
        }, this);
    }
    // Only show blocking errors for schema/loading issues, not save errors
    if (schemaError) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-red-50 border border-red-200 rounded-lg p-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "text-red-800 font-medium",
                    children: "Schema Error"
                }, void 0, false, {
                    fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                    lineNumber: 423,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-red-700 text-sm mt-1",
                    children: schemaError
                }, void 0, false, {
                    fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                    lineNumber: 424,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
            lineNumber: 422,
            columnNumber: 7
        }, this);
    }
    // Only show blocking error for cellLineError if it's NOT a save error
    // (Save errors should be handled separately and not block the editor)
    if (cellLineError && !selectedCellLine) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-red-50 border border-red-200 rounded-lg p-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "text-red-800 font-medium",
                    children: "Loading Error"
                }, void 0, false, {
                    fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                    lineNumber: 436,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-red-700 text-sm mt-1",
                    children: cellLineError
                }, void 0, false, {
                    fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                    lineNumber: 437,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
            lineNumber: 435,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$components$2f$ErrorBoundary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ErrorBoundary"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-8b6c29b6f99345c4" + " " + "space-y-6",
                children: [
                    saveError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-8b6c29b6f99345c4" + " " + "bg-red-50 border border-red-200 rounded-lg p-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-8b6c29b6f99345c4" + " " + "flex items-start justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-8b6c29b6f99345c4" + " " + "flex items-start",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-8b6c29b6f99345c4" + " " + "flex-shrink-0",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                viewBox: "0 0 20 20",
                                                fill: "currentColor",
                                                className: "jsx-8b6c29b6f99345c4" + " " + "h-5 w-5 text-red-400 mt-0.5",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    fillRule: "evenodd",
                                                    d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",
                                                    clipRule: "evenodd",
                                                    className: "jsx-8b6c29b6f99345c4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                                                    lineNumber: 454,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                                                lineNumber: 453,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                                            lineNumber: 452,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-8b6c29b6f99345c4" + " " + "ml-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "jsx-8b6c29b6f99345c4" + " " + "text-red-800 font-medium text-sm",
                                                    children: "Save Failed"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                                                    lineNumber: 458,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "jsx-8b6c29b6f99345c4" + " " + "text-red-700 text-sm mt-1",
                                                    children: saveError
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                                                    lineNumber: 459,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "jsx-8b6c29b6f99345c4" + " " + "text-red-600 text-xs mt-2",
                                                    children: "Please fix the issue and try saving again."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                                                    lineNumber: 462,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                                            lineNumber: 457,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                                    lineNumber: 451,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: dismissSaveError,
                                    title: "Dismiss error",
                                    className: "jsx-8b6c29b6f99345c4" + " " + "ml-4 text-red-400 hover:text-red-600 transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        viewBox: "0 0 20 20",
                                        fill: "currentColor",
                                        className: "jsx-8b6c29b6f99345c4" + " " + "h-5 w-5",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            fillRule: "evenodd",
                                            d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
                                            clipRule: "evenodd",
                                            className: "jsx-8b6c29b6f99345c4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                                            lineNumber: 473,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                                        lineNumber: 472,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                                    lineNumber: 467,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                            lineNumber: 450,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                        lineNumber: 449,
                        columnNumber: 11
                    }, this),
                    !hideSelector && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-8b6c29b6f99345c4" + " " + "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-8b6c29b6f99345c4" + " " + "flex items-center space-x-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "curation-source-filter",
                                        className: "jsx-8b6c29b6f99345c4" + " " + "text-sm font-medium text-gray-700",
                                        children: "Curation Source:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                                        lineNumber: 484,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-8b6c29b6f99345c4" + " " + "relative",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            id: "curation-source-filter",
                                            value: curationSourceFilter,
                                            onChange: (e)=>setCurationSourceFilter(e.target.value),
                                            className: "jsx-8b6c29b6f99345c4" + " " + "border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 min-w-[150px]",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "",
                                                    className: "jsx-8b6c29b6f99345c4",
                                                    children: "All Sources"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                                                    lineNumber: 494,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "hpscreg",
                                                    className: "jsx-8b6c29b6f99345c4",
                                                    children: "HPSCREG"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                                                    lineNumber: 495,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "LLM",
                                                    className: "jsx-8b6c29b6f99345c4",
                                                    children: "LLM Generated"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                                                    lineNumber: 496,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "institution",
                                                    className: "jsx-8b6c29b6f99345c4",
                                                    children: "Institution"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                                                    lineNumber: 497,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "manual",
                                                    className: "jsx-8b6c29b6f99345c4",
                                                    children: "Manual Entry"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                                                    lineNumber: 498,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                                            lineNumber: 488,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                                        lineNumber: 487,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "cellline-select",
                                        className: "jsx-8b6c29b6f99345c4" + " " + "text-sm font-medium text-gray-700",
                                        children: "Select Cell Line:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                                        lineNumber: 502,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-8b6c29b6f99345c4" + " " + "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                id: "cellline-select",
                                                value: selectedCellLineId,
                                                onChange: (e)=>handleCellLineSelect(e.target.value),
                                                className: "jsx-8b6c29b6f99345c4" + " " + "border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 min-w-[200px]",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "",
                                                        className: "jsx-8b6c29b6f99345c4",
                                                        children: "Choose a cell line..."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                                                        lineNumber: 512,
                                                        columnNumber: 17
                                                    }, this),
                                                    cellLines.map((cellLine)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: cellLine.CellLine_hpscreg_id || cellLine.template_name,
                                                            className: "jsx-8b6c29b6f99345c4",
                                                            children: [
                                                                cellLine.CellLine_hpscreg_id || cellLine.template_name,
                                                                cellLine.curation_source && ` (${cellLine.curation_source})`
                                                            ]
                                                        }, cellLine.CellLine_hpscreg_id || cellLine.template_name, true, {
                                                            fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                                                            lineNumber: 514,
                                                            columnNumber: 19
                                                        }, this))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                                                lineNumber: 506,
                                                columnNumber: 15
                                            }, this),
                                            cellLines.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-8b6c29b6f99345c4" + " " + "text-xs text-gray-500 mt-1",
                                                children: [
                                                    cellLines.length,
                                                    " cell lines available"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                                                lineNumber: 524,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                                        lineNumber: 505,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            // TODO: Implement add cell line functionality
                                            console.log('Add cell line clicked');
                                        },
                                        title: "Create a new cell line",
                                        className: "jsx-8b6c29b6f99345c4" + " " + "bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-all shadow-sm hover:shadow flex items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                fill: "none",
                                                stroke: "currentColor",
                                                viewBox: "0 0 24 24",
                                                className: "jsx-8b6c29b6f99345c4" + " " + "w-4 h-4 mr-2",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: 2,
                                                    d: "M12 4v16m8-8H4",
                                                    className: "jsx-8b6c29b6f99345c4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                                                    lineNumber: 540,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                                                lineNumber: 539,
                                                columnNumber: 15
                                            }, this),
                                            "Add Cell Line"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                                        lineNumber: 531,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                                lineNumber: 483,
                                columnNumber: 11
                            }, this),
                            selectedCellLineId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-8b6c29b6f99345c4" + " " + "flex items-center space-x-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleUndo,
                                        disabled: !canUndo,
                                        title: canUndo ? `Undo last change (${changeHistory.length} changes available)` : 'No changes to undo',
                                        className: "jsx-8b6c29b6f99345c4" + " " + "bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 text-white text-sm font-medium py-2 px-4 rounded-md transition-all shadow-sm hover:shadow flex items-center",
                                        children: "Undo"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                                        lineNumber: 548,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleRevertAll,
                                        disabled: changeHistory.length === 0,
                                        title: changeHistory.length > 0 ? 'Revert all changes back to original state' : 'No changes to revert',
                                        className: "jsx-8b6c29b6f99345c4" + " " + "bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 text-white text-sm font-medium py-2 px-4 rounded-md transition-all shadow-sm hover:shadow flex items-center",
                                        children: "Revert All"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                                        lineNumber: 556,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleSave,
                                        disabled: isSaving,
                                        className: "jsx-8b6c29b6f99345c4" + " " + "bg-blue-800 hover:bg-blue-900 disabled:bg-blue-300 text-white text-sm font-medium py-2 px-4 rounded-md transition-all shadow-sm hover:shadow flex items-center",
                                        children: isSaving ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-8b6c29b6f99345c4" + " " + "animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                                                    lineNumber: 571,
                                                    columnNumber: 21
                                                }, this),
                                                "Saving..."
                                            ]
                                        }, void 0, true) : 'Save Changes'
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                                        lineNumber: 564,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                                lineNumber: 547,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                        lineNumber: 482,
                        columnNumber: 9
                    }, this),
                    selectedCellLineId && displayLines.length > 0 && schema ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-8b6c29b6f99345c4" + " " + "border border-gray-200 rounded-lg overflow-hidden relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-8b6c29b6f99345c4" + " " + "bg-gray-50 px-4 py-2 border-b border-gray-200",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "jsx-8b6c29b6f99345c4" + " " + "text-sm font-medium text-gray-900",
                                        children: selectedCellLineId
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                                        lineNumber: 588,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "jsx-8b6c29b6f99345c4" + " " + "text-xs text-gray-600 mt-1",
                                        children: [
                                            displayLines.length,
                                            " fields • Click values to edit"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                                        lineNumber: 591,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                                lineNumber: 587,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-8b6c29b6f99345c4" + " " + "custom-editor bg-white",
                                children: getVisibleLines(displayLines).map((line)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$components$2f$EditorLine$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        line: line,
                                        schema: schema,
                                        isEditing: editingLine === line.lineNumber,
                                        onToggleCollapse: ()=>toggleCollapse(line.lineNumber),
                                        onStartEdit: ()=>startEditing(line.lineNumber),
                                        onCancelEdit: cancelEditing,
                                        onUpdateValue: updateValue,
                                        onAddItem: ()=>handleAddItem(line.fieldPath)
                                    }, line.lineNumber, false, {
                                        fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                                        lineNumber: 598,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                                lineNumber: 596,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleSave,
                                disabled: isSaving,
                                title: isSaving ? 'Saving...' : 'Save Changes',
                                className: "jsx-8b6c29b6f99345c4" + " " + "absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white p-3 rounded-full shadow-lg transition-all hover:shadow-xl flex items-center justify-center",
                                children: isSaving ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-8b6c29b6f99345c4" + " " + "animate-spin rounded-full h-5 w-5 border-b-2 border-white"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                                    lineNumber: 620,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    fill: "currentColor",
                                    viewBox: "0 0 24 24",
                                    className: "jsx-8b6c29b6f99345c4" + " " + "w-5 h-5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M17,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3M19,19H5V5H15V9H19V19Z",
                                            className: "jsx-8b6c29b6f99345c4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                                            lineNumber: 623,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M7,5V9H13V5H7M6,14A2,2 0 0,1 8,12A2,2 0 0,1 10,14A2,2 0 0,1 8,16A2,2 0 0,1 6,14Z",
                                            fill: "white",
                                            className: "jsx-8b6c29b6f99345c4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                                            lineNumber: 624,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                                    lineNumber: 622,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                                lineNumber: 613,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                        lineNumber: 586,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-8b6c29b6f99345c4" + " " + "text-center py-12 text-gray-500",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "jsx-8b6c29b6f99345c4",
                            children: "Select a cell line to begin editing"
                        }, void 0, false, {
                            fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                            lineNumber: 631,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                        lineNumber: 630,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
                lineNumber: 446,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "8b6c29b6f99345c4",
                children: ".custom-editor.jsx-8b6c29b6f99345c4{overscroll-behavior-y:contain;max-height:600px;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif;font-size:14px;line-height:1.6;overflow-y:auto}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx",
        lineNumber: 445,
        columnNumber: 5
    }, this);
}
_s(CustomCellLineEditor, "BwEgBaakHQierNZCvEfqpK5fNDg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$hooks$2f$useCellLineData$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCellLineData"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$hooks$2f$useSchemaData$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSchemaData"]
    ];
});
_c = CustomCellLineEditor;
var _c;
__turbopack_context__.k.register(_c, "CustomCellLineEditor");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/tools/curation/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>CurationPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$curation$2f$components$2f$ArticlesTable$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tools/curation/components/ArticlesTable.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$curation$2f$components$2f$ErrorModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tools/curation/components/ErrorModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$components$2f$ErrorBoundary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tools/editor/components/ErrorBoundary.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$curation$2f$hooks$2f$useStatusPolling$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tools/curation/hooks/useStatusPolling.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$components$2f$CustomCellLineEditor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
function CurationPage() {
    _s();
    const [selectedArticles, setSelectedArticles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isPolling, setIsPolling] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [errorModalOpen, setErrorModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [errorDetails, setErrorDetails] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [errorDetailsLoading, setErrorDetailsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // New state for three-section workflow
    const [curationResults, setCurationResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Map());
    const [allCuratedCellLines, setAllCuratedCellLines] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedCellLineId, setSelectedCellLineId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedCellLineData, setSelectedCellLineData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [curationInProgress, setCurationInProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showConfirmation, setShowConfirmation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [curationError, setCurationError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Track cell lines that have been reviewed and saved (persist across refreshes)
    const [reviewedCellLineIds, setReviewedCellLineIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "CurationPage.useState": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                const saved = localStorage.getItem('curation-reviewed-cell-lines');
                return saved ? new Set(JSON.parse(saved)) : new Set();
            }
            "TURBOPACK unreachable";
        }
    }["CurationPage.useState"]);
    // Initial articles fetch
    const [initialArticles, setInitialArticles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [initialLoading, setInitialLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [initialError, setInitialError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CurationPage.useEffect": ()=>{
            fetchInitialArticles();
        }
    }["CurationPage.useEffect"], []);
    const fetchInitialArticles = async ()=>{
        try {
            setInitialLoading(true);
            const response = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].CURATION.ARTICLES);
            if (!response.ok) throw new Error('Failed to fetch articles');
            const data = await response.json();
            setInitialArticles(data.articles);
        } catch (err) {
            setInitialError(err instanceof Error ? err.message : 'Failed to load articles');
        } finally{
            setInitialLoading(false);
        }
    };
    // Real-time status polling with seamless background updates
    const { articles, status, loading: pollingLoading, error: pollingError, refresh, startPolling, stopPolling } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$curation$2f$hooks$2f$useStatusPolling$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStatusPolling"])(initialArticles, isPolling, 3000);
    // Start polling when curation is initiated
    const handleCurationStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CurationPage.useCallback[handleCurationStart]": ()=>{
            setIsPolling(true);
            setCurationInProgress(true);
            setSelectedArticles([]);
            setCurationResults(new Map());
            setAllCuratedCellLines([]);
            setSelectedCellLineId(null);
            setSelectedCellLineData(null);
            // Clear reviewed cell lines for new curation session
            setReviewedCellLineIds(new Set());
            if ("TURBOPACK compile-time truthy", 1) {
                localStorage.removeItem('curation-reviewed-cell-lines');
            }
            // Initial refresh to get updated status
            refresh();
        }
    }["CurationPage.useCallback[handleCurationStart]"], [
        refresh
    ]);
    // Fetch cell lines for completed articles
    const fetchCellLinesForArticle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CurationPage.useCallback[fetchCellLinesForArticle]": async (articleId)=>{
            try {
                const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].CURATION.BASE}/${articleId}/celllines/`);
                if (!response.ok) throw new Error('Failed to fetch cell lines');
                const data = await response.json();
                const result = {
                    article_id: data.article_id,
                    article_pubmed_id: data.article_pubmed_id,
                    status: 'completed',
                    cell_lines: data.cell_lines,
                    total_found: data.count
                };
                return result;
            } catch (error) {
                console.error(`Failed to fetch cell lines for article ${articleId}:`, error);
                return {
                    article_id: articleId,
                    article_pubmed_id: null,
                    status: 'failed',
                    cell_lines: [],
                    error: error instanceof Error ? error.message : 'Failed to fetch cell lines'
                };
            }
        }
    }["CurationPage.useCallback[fetchCellLinesForArticle]"], []);
    // Update curation results when articles complete (only for new completions)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CurationPage.useEffect": ()=>{
            if (articles.length > 0) {
                articles.forEach({
                    "CurationPage.useEffect": async (article)=>{
                        // Only fetch if article is completed AND we don't already have its results
                        if (article.curation_status === 'completed' && !curationResults.has(article.id)) {
                            const result = await fetchCellLinesForArticle(article.id);
                            setCurationResults({
                                "CurationPage.useEffect": (prev)=>new Map(prev.set(article.id, result))
                            }["CurationPage.useEffect"]);
                        }
                    }
                }["CurationPage.useEffect"]);
            }
        }
    }["CurationPage.useEffect"], [
        articles,
        fetchCellLinesForArticle
    ]); // Removed curationResults from dependencies to prevent re-fetching
    // Update flattened cell lines list when curation results change, filtering out reviewed ones
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CurationPage.useEffect": ()=>{
            const flattenedCellLines = [];
            curationResults.forEach({
                "CurationPage.useEffect": (result)=>{
                    // Only include cell lines that haven't been reviewed yet
                    const unreviewedCellLines = result.cell_lines.filter({
                        "CurationPage.useEffect.unreviewedCellLines": (cellLine)=>!reviewedCellLineIds.has(cellLine.CellLine_hpscreg_id)
                    }["CurationPage.useEffect.unreviewedCellLines"]);
                    flattenedCellLines.push(...unreviewedCellLines);
                }
            }["CurationPage.useEffect"]);
            setAllCuratedCellLines(flattenedCellLines);
            // Auto-select first cell line if none is currently selected and we have cell lines
            if (flattenedCellLines.length > 0 && !selectedCellLineId) {
                const firstCellLine = flattenedCellLines[0];
                setSelectedCellLineId(firstCellLine.CellLine_hpscreg_id);
                setSelectedCellLineData(firstCellLine);
            }
            // Clear selection if no cell lines are left
            if (flattenedCellLines.length === 0 && selectedCellLineId) {
                setSelectedCellLineId(null);
                setSelectedCellLineData(null);
            }
        }
    }["CurationPage.useEffect"], [
        curationResults,
        reviewedCellLineIds,
        selectedCellLineId
    ]);
    // Stop polling when all processing is complete
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CurationPage.useEffect": ()=>{
            if (status && status.processing_count === 0 && isPolling) {
                // Wait a bit to ensure all updates are processed
                const timeout = setTimeout({
                    "CurationPage.useEffect.timeout": ()=>{
                        setIsPolling(false);
                        setCurationInProgress(false);
                    }
                }["CurationPage.useEffect.timeout"], 5000);
                return ({
                    "CurationPage.useEffect": ()=>clearTimeout(timeout)
                })["CurationPage.useEffect"];
            }
        }
    }["CurationPage.useEffect"], [
        status,
        isPolling
    ]);
    // Handle error modal
    const handleErrorClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CurationPage.useCallback[handleErrorClick]": async (articleId)=>{
            setErrorDetailsLoading(true);
            setErrorModalOpen(true);
            try {
                const response = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].CURATION.ERROR_DETAILS(articleId));
                if (!response.ok) throw new Error('Failed to fetch error details');
                const data = await response.json();
                setErrorDetails(data);
            } catch (err) {
                setErrorDetails({
                    article_id: articleId,
                    error_message: 'Failed to load error details',
                    curation_status: 'failed',
                    failed_at: new Date().toISOString()
                });
            } finally{
                setErrorDetailsLoading(false);
            }
        }
    }["CurationPage.useCallback[handleErrorClick]"], []);
    const handleErrorModalClose = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CurationPage.useCallback[handleErrorModalClose]": ()=>{
            setErrorModalOpen(false);
            setErrorDetails(null);
        }
    }["CurationPage.useCallback[handleErrorModalClose]"], []);
    // Handle retry functionality
    const handleRetryClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CurationPage.useCallback[handleRetryClick]": async (articleId)=>{
            try {
                const response = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].CURATION.RETRY(articleId), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || 'Failed to retry curation');
                }
                // Start polling to track the retried article
                setIsPolling(true);
                // Refresh immediately to show processing status
                refresh();
            } catch (err) {
                console.error('Retry failed:', err);
                throw err; // Re-throw so the table component can handle it
            }
        }
    }["CurationPage.useCallback[handleRetryClick]"], [
        refresh
    ]);
    // Handle cell line selection for editing
    const handleCellLineSelect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CurationPage.useCallback[handleCellLineSelect]": (cellLineId)=>{
            setSelectedCellLineId(cellLineId);
            const cellLine = allCuratedCellLines.find({
                "CurationPage.useCallback[handleCellLineSelect].cellLine": (cl)=>cl.CellLine_hpscreg_id === cellLineId
            }["CurationPage.useCallback[handleCellLineSelect].cellLine"]);
            setSelectedCellLineData(cellLine || null);
        }
    }["CurationPage.useCallback[handleCellLineSelect]"], [
        allCuratedCellLines
    ]);
    // Handle cell line save success - mark as reviewed and auto-select next
    const handleCellLineSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CurationPage.useCallback[handleCellLineSave]": (savedData)=>{
            const cellLineId = savedData.CellLine_hpscreg_id;
            // Find the next cell line to select before removing the current one
            const currentIndex = allCuratedCellLines.findIndex({
                "CurationPage.useCallback[handleCellLineSave].currentIndex": (cl)=>cl.CellLine_hpscreg_id === cellLineId
            }["CurationPage.useCallback[handleCellLineSave].currentIndex"]);
            const nextCellLine = allCuratedCellLines[currentIndex + 1] || allCuratedCellLines[currentIndex - 1];
            // Mark this cell line as reviewed and persist to localStorage
            setReviewedCellLineIds({
                "CurationPage.useCallback[handleCellLineSave]": (prev)=>{
                    const newSet = new Set(prev);
                    newSet.add(cellLineId);
                    // Persist to localStorage
                    if ("TURBOPACK compile-time truthy", 1) {
                        localStorage.setItem('curation-reviewed-cell-lines', JSON.stringify([
                            ...newSet
                        ]));
                    }
                    return newSet;
                }
            }["CurationPage.useCallback[handleCellLineSave]"]);
            // Auto-select the next cell line for smooth workflow, or clear if none left
            if (nextCellLine) {
                setSelectedCellLineId(nextCellLine.CellLine_hpscreg_id);
                setSelectedCellLineData(nextCellLine);
            } else {
                setSelectedCellLineId(null);
                setSelectedCellLineData(null);
            }
        }
    }["CurationPage.useCallback[handleCellLineSave]"], [
        allCuratedCellLines
    ]);
    // Handle cell line save error
    const handleCellLineError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CurationPage.useCallback[handleCellLineError]": (error)=>{
            console.error('Cell line save error:', error);
        // The error is already displayed in the editor component
        }
    }["CurationPage.useCallback[handleCellLineError]"], []);
    // Handle curation start button click
    const handleCurationStartClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CurationPage.useCallback[handleCurationStartClick]": ()=>{
            if (selectedArticles.length === 0) {
                setCurationError('Please select at least one article to curate.');
                return;
            }
            if (selectedArticles.length > 20) {
                setCurationError('Maximum 20 articles can be curated at once.');
                return;
            }
            setShowConfirmation(true);
        }
    }["CurationPage.useCallback[handleCurationStartClick]"], [
        selectedArticles
    ]);
    // Handle confirmed bulk curation start
    const handleConfirmedCurationStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CurationPage.useCallback[handleConfirmedCurationStart]": async ()=>{
            setShowConfirmation(false);
            setCurationError(null);
            try {
                const response = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].CURATION.BULK_CURATE, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        article_ids: selectedArticles
                    })
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || 'Failed to start curation');
                }
                // Start the curation workflow
                handleCurationStart();
            } catch (err) {
                setCurationError(err instanceof Error ? err.message : 'Failed to start curation');
            }
        }
    }["CurationPage.useCallback[handleConfirmedCurationStart]"], [
        selectedArticles,
        handleCurationStart
    ]);
    // Combine loading states
    const isLoading = initialLoading || isPolling && pollingLoading;
    const error = initialError || pollingError;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$components$2f$ErrorBoundary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ErrorBoundary"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-6 max-w-7xl mx-auto",
            children: [
                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-4 p-4 bg-red-50 border border-red-200 rounded-lg",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-red-700",
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/src/app/tools/curation/page.tsx",
                            lineNumber: 367,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: fetchInitialArticles,
                            className: "mt-2 text-red-600 hover:text-red-800 underline",
                            children: "Retry"
                        }, void 0, false, {
                            fileName: "[project]/src/app/tools/curation/page.tsx",
                            lineNumber: 368,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/tools/curation/page.tsx",
                    lineNumber: 366,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-xl font-semibold text-gray-900 mb-4",
                            children: "Article Selection"
                        }, void 0, false, {
                            fileName: "[project]/src/app/tools/curation/page.tsx",
                            lineNumber: 380,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$curation$2f$components$2f$ArticlesTable$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ArticlesTable"], {
                            articles: articles,
                            selectedArticles: selectedArticles,
                            onSelectionChange: setSelectedArticles,
                            loading: isLoading,
                            onStartCuration: handleCurationStartClick,
                            onErrorClick: handleErrorClick,
                            onRetryClick: handleRetryClick,
                            isPolling: isPolling
                        }, void 0, false, {
                            fileName: "[project]/src/app/tools/curation/page.tsx",
                            lineNumber: 382,
                            columnNumber: 11
                        }, this),
                        curationError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-4 p-4 bg-red-50 border border-red-200 rounded-lg",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-red-700 text-sm",
                                children: curationError
                            }, void 0, false, {
                                fileName: "[project]/src/app/tools/curation/page.tsx",
                                lineNumber: 396,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/tools/curation/page.tsx",
                            lineNumber: 395,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/tools/curation/page.tsx",
                    lineNumber: 379,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-xl font-semibold text-gray-900 mb-4",
                            children: "Curation Results"
                        }, void 0, false, {
                            fileName: "[project]/src/app/tools/curation/page.tsx",
                            lineNumber: 403,
                            columnNumber: 11
                        }, this),
                        curationInProgress || curationResults.size > 0 || articles.some((article)=>article.curation_status === 'completed') ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white rounded-lg border border-gray-200 p-6",
                            children: [
                                Array.from(curationResults.entries()).map(([articleId, result])=>{
                                    return result.status === 'failed' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-4 last:mb-0",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-red-600",
                                            children: [
                                                "✗ Failed to process article ",
                                                result.article_pubmed_id || articleId,
                                                ": ",
                                                result.error
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/tools/curation/page.tsx",
                                            lineNumber: 410,
                                            columnNumber: 21
                                        }, this)
                                    }, articleId, false, {
                                        fileName: "[project]/src/app/tools/curation/page.tsx",
                                        lineNumber: 409,
                                        columnNumber: 19
                                    }, this) : null;
                                }).filter(Boolean),
                                articles.filter((article)=>selectedArticles.includes(article.id) && article.curation_status === 'processing' && !curationResults.has(article.id)).map((article)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-4 text-blue-600",
                                        children: [
                                            "Processing article ",
                                            article.pubmed_id || article.id,
                                            "..."
                                        ]
                                    }, article.id, true, {
                                        fileName: "[project]/src/app/tools/curation/page.tsx",
                                        lineNumber: 425,
                                        columnNumber: 19
                                    }, this)),
                                curationResults.size > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "max-h-96 overflow-y-auto space-y-4",
                                        children: Array.from(curationResults.entries()).map(([articleId, result])=>{
                                            if (result.status !== 'completed') return null;
                                            // Filter out reviewed cell lines for this article
                                            const unreviewedCellLines = result.cell_lines.filter((cellLine)=>!reviewedCellLineIds.has(cellLine.CellLine_hpscreg_id));
                                            if (unreviewedCellLines.length === 0) return null;
                                            // Find the article to get its filename
                                            const article = articles.find((a)=>a.id === articleId);
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "border border-gray-200 rounded-lg bg-white shadow-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "px-4 py-3 border-b border-gray-200 flex justify-between items-center",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                className: "text-sm text-gray-900 italic",
                                                                children: [
                                                                    "Title: ",
                                                                    unreviewedCellLines[0]?.CellLine_publication_title || article?.filename || `Article ${articleId}`
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/tools/curation/page.tsx",
                                                                lineNumber: 452,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xs text-gray-500",
                                                                children: [
                                                                    "PubMed: ",
                                                                    result.article_pubmed_id || 'N/A'
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/tools/curation/page.tsx",
                                                                lineNumber: 455,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/tools/curation/page.tsx",
                                                        lineNumber: 451,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "overflow-x-auto",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                                            className: "min-w-full divide-y divide-gray-200",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                                    className: "bg-gray-50",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                                className: "px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                                                children: "ID"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/tools/curation/page.tsx",
                                                                                lineNumber: 465,
                                                                                columnNumber: 35
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                                className: "px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                                                children: "Type"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/tools/curation/page.tsx",
                                                                                lineNumber: 468,
                                                                                columnNumber: 35
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                                className: "px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                                                children: "Source"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/tools/curation/page.tsx",
                                                                                lineNumber: 471,
                                                                                columnNumber: 35
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                                className: "px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                                                children: "Status"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/tools/curation/page.tsx",
                                                                                lineNumber: 474,
                                                                                columnNumber: 35
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/tools/curation/page.tsx",
                                                                        lineNumber: 464,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/tools/curation/page.tsx",
                                                                    lineNumber: 463,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                                    className: "bg-white divide-y divide-gray-200",
                                                                    children: unreviewedCellLines.map((cellLine)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                            className: `cursor-pointer hover:bg-gray-50 ${selectedCellLineId === cellLine.CellLine_hpscreg_id ? 'bg-blue-50' : ''}`,
                                                                            onClick: ()=>handleCellLineSelect(cellLine.CellLine_hpscreg_id),
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    className: "px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900",
                                                                                    children: cellLine.CellLine_hpscreg_id
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/tools/curation/page.tsx",
                                                                                    lineNumber: 488,
                                                                                    columnNumber: 37
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    className: "px-4 py-3 whitespace-nowrap text-sm text-gray-500",
                                                                                    children: cellLine.CellLine_cell_line_type
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/tools/curation/page.tsx",
                                                                                    lineNumber: 491,
                                                                                    columnNumber: 37
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    className: "px-4 py-3 whitespace-nowrap text-sm text-gray-500",
                                                                                    children: cellLine.CellLine_source_cell_type || 'Unknown'
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/tools/curation/page.tsx",
                                                                                    lineNumber: 494,
                                                                                    columnNumber: 37
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    className: "px-4 py-3 whitespace-nowrap",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: `inline-flex px-2 py-1 text-xs font-semibold rounded-full ${cellLine.work_status === 'in progress' ? 'bg-yellow-100 text-yellow-800' : cellLine.work_status === 'for review' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`,
                                                                                        children: cellLine.work_status
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/tools/curation/page.tsx",
                                                                                        lineNumber: 498,
                                                                                        columnNumber: 39
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/tools/curation/page.tsx",
                                                                                    lineNumber: 497,
                                                                                    columnNumber: 37
                                                                                }, this)
                                                                            ]
                                                                        }, cellLine.CellLine_hpscreg_id, true, {
                                                                            fileName: "[project]/src/app/tools/curation/page.tsx",
                                                                            lineNumber: 481,
                                                                            columnNumber: 35
                                                                        }, this))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/tools/curation/page.tsx",
                                                                    lineNumber: 479,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/tools/curation/page.tsx",
                                                            lineNumber: 462,
                                                            columnNumber: 29
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/tools/curation/page.tsx",
                                                        lineNumber: 461,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, articleId, true, {
                                                fileName: "[project]/src/app/tools/curation/page.tsx",
                                                lineNumber: 449,
                                                columnNumber: 25
                                            }, this);
                                        }).filter(Boolean)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/tools/curation/page.tsx",
                                        lineNumber: 434,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/tools/curation/page.tsx",
                                    lineNumber: 433,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/tools/curation/page.tsx",
                            lineNumber: 405,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-gray-50 rounded-lg border border-gray-200 p-6 text-center text-gray-500",
                            children: "Results will appear here when curation is started"
                        }, void 0, false, {
                            fileName: "[project]/src/app/tools/curation/page.tsx",
                            lineNumber: 519,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/tools/curation/page.tsx",
                    lineNumber: 402,
                    columnNumber: 9
                }, this),
                selectedCellLineId && selectedCellLineData && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-8",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$components$2f$CustomCellLineEditor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        initialCellLineId: selectedCellLineId,
                        hideSelector: true,
                        onSave: handleCellLineSave,
                        onError: handleCellLineError
                    }, void 0, false, {
                        fileName: "[project]/src/app/tools/curation/page.tsx",
                        lineNumber: 528,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/tools/curation/page.tsx",
                    lineNumber: 527,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$curation$2f$components$2f$ErrorModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ErrorModal"], {
                    isOpen: errorModalOpen,
                    onClose: handleErrorModalClose,
                    errorDetails: errorDetails,
                    loading: errorDetailsLoading
                }, void 0, false, {
                    fileName: "[project]/src/app/tools/curation/page.tsx",
                    lineNumber: 537,
                    columnNumber: 9
                }, this),
                showConfirmation && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-3 text-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-medium text-gray-900",
                                    children: "Confirm Curation"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/tools/curation/page.tsx",
                                    lineNumber: 549,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-2 px-7 py-3",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-gray-500",
                                        children: [
                                            "Are you sure you want to start curation for ",
                                            selectedArticles.length,
                                            " article",
                                            selectedArticles.length !== 1 ? 's' : '',
                                            "? This process may take several minutes to complete."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/tools/curation/page.tsx",
                                        lineNumber: 551,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/tools/curation/page.tsx",
                                    lineNumber: 550,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "items-center px-4 py-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleConfirmedCurationStart,
                                            className: "px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-md w-24 mr-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500",
                                            children: "Confirm"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/tools/curation/page.tsx",
                                            lineNumber: 557,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setShowConfirmation(false),
                                            className: "px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md w-24 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500",
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/tools/curation/page.tsx",
                                            lineNumber: 563,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/tools/curation/page.tsx",
                                    lineNumber: 556,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/tools/curation/page.tsx",
                            lineNumber: 548,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/tools/curation/page.tsx",
                        lineNumber: 547,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/tools/curation/page.tsx",
                    lineNumber: 546,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/tools/curation/page.tsx",
            lineNumber: 363,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/tools/curation/page.tsx",
        lineNumber: 362,
        columnNumber: 5
    }, this);
}
_s(CurationPage, "T+0EQQ6/FNtwH3G+OgN+syCyqqQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$curation$2f$hooks$2f$useStatusPolling$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStatusPolling"]
    ];
});
_c = CurationPage;
var _c;
__turbopack_context__.k.register(_c, "CurationPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_b472ed3c._.js.map