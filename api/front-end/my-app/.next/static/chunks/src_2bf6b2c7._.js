(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/app/tools/editor/components/VersionSelector.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "VersionSelector": (()=>VersionSelector)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function VersionSelector({ label, placeholder, options, value, onChange, isLoading = false, disabled = false, searchable = false }) {
    _s();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const dropdownRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const filteredOptions = searchable && searchTerm ? options.filter((option)=>option.label.toLowerCase().includes(searchTerm.toLowerCase()) || option.subtitle?.toLowerCase().includes(searchTerm.toLowerCase())) : options;
    const selectedOption = options.find((option)=>option.id === value);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VersionSelector.useEffect": ()=>{
            const handleClickOutside = {
                "VersionSelector.useEffect.handleClickOutside": (event)=>{
                    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                        setIsOpen(false);
                        setSearchTerm('');
                    }
                }
            }["VersionSelector.useEffect.handleClickOutside"];
            document.addEventListener('mousedown', handleClickOutside);
            return ({
                "VersionSelector.useEffect": ()=>document.removeEventListener('mousedown', handleClickOutside)
            })["VersionSelector.useEffect"];
        }
    }["VersionSelector.useEffect"], []);
    const handleSelect = (optionId)=>{
        onChange(optionId);
        setIsOpen(false);
        setSearchTerm('');
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative",
        ref: dropdownRef,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "block text-sm font-medium text-gray-700 mb-1",
                children: label
            }, void 0, false, {
                fileName: "[project]/src/app/tools/editor/components/VersionSelector.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: ()=>!disabled && !isLoading && setIsOpen(!isOpen),
                disabled: disabled || isLoading,
                className: `relative w-full bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm ${disabled || isLoading ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'hover:border-gray-400'}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "block truncate",
                        children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "flex items-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/tools/editor/components/VersionSelector.tsx",
                                    lineNumber: 80,
                                    columnNumber: 15
                                }, this),
                                "Loading..."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/tools/editor/components/VersionSelector.tsx",
                            lineNumber: 79,
                            columnNumber: 13
                        }, this) : selectedOption ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: [
                                selectedOption.label,
                                selectedOption.subtitle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-gray-500 ml-1",
                                    children: [
                                        "(",
                                        selectedOption.subtitle,
                                        ")"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/tools/editor/components/VersionSelector.tsx",
                                    lineNumber: 87,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/tools/editor/components/VersionSelector.tsx",
                            lineNumber: 84,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-gray-400",
                            children: placeholder
                        }, void 0, false, {
                            fileName: "[project]/src/app/tools/editor/components/VersionSelector.tsx",
                            lineNumber: 91,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/tools/editor/components/VersionSelector.tsx",
                        lineNumber: 77,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: `h-5 w-5 text-gray-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`,
                            xmlns: "http://www.w3.org/2000/svg",
                            viewBox: "0 0 20 20",
                            fill: "currentColor",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                fillRule: "evenodd",
                                d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",
                                clipRule: "evenodd"
                            }, void 0, false, {
                                fileName: "[project]/src/app/tools/editor/components/VersionSelector.tsx",
                                lineNumber: 101,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/tools/editor/components/VersionSelector.tsx",
                            lineNumber: 95,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/tools/editor/components/VersionSelector.tsx",
                        lineNumber: 94,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/tools/editor/components/VersionSelector.tsx",
                lineNumber: 69,
                columnNumber: 7
            }, this),
            isOpen && !isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm",
                children: [
                    searchable && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-3 py-2 border-b border-gray-200",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "text",
                            className: "w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500",
                            placeholder: "Search...",
                            value: searchTerm,
                            onChange: (e)=>setSearchTerm(e.target.value),
                            onClick: (e)=>e.stopPropagation()
                        }, void 0, false, {
                            fileName: "[project]/src/app/tools/editor/components/VersionSelector.tsx",
                            lineNumber: 114,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/tools/editor/components/VersionSelector.tsx",
                        lineNumber: 113,
                        columnNumber: 13
                    }, this),
                    filteredOptions.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-3 py-2 text-sm text-gray-500",
                        children: searchTerm ? 'No results found' : 'No options available'
                    }, void 0, false, {
                        fileName: "[project]/src/app/tools/editor/components/VersionSelector.tsx",
                        lineNumber: 126,
                        columnNumber: 13
                    }, this) : filteredOptions.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>handleSelect(option.id),
                            className: `w-full text-left px-3 py-2 text-sm hover:bg-gray-100 focus:outline-none focus:bg-gray-100 ${value === option.id ? 'bg-blue-50 text-blue-900' : 'text-gray-900'}`,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: option.label
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/tools/editor/components/VersionSelector.tsx",
                                        lineNumber: 139,
                                        columnNumber: 19
                                    }, this),
                                    option.subtitle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-gray-500",
                                        children: option.subtitle
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/tools/editor/components/VersionSelector.tsx",
                                        lineNumber: 141,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/tools/editor/components/VersionSelector.tsx",
                                lineNumber: 138,
                                columnNumber: 17
                            }, this)
                        }, option.id, false, {
                            fileName: "[project]/src/app/tools/editor/components/VersionSelector.tsx",
                            lineNumber: 131,
                            columnNumber: 15
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/tools/editor/components/VersionSelector.tsx",
                lineNumber: 111,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/tools/editor/components/VersionSelector.tsx",
        lineNumber: 64,
        columnNumber: 5
    }, this);
}
_s(VersionSelector, "0OiaxN2WrlEGTfdB7f0+z8zar8k=");
_c = VersionSelector;
var _c;
__turbopack_context__.k.register(_c, "VersionSelector");
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
"[project]/src/app/tools/editor/utils/diffAlgorithm.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "deepEqual": (()=>deepEqual),
    "determineChangeType": (()=>determineChangeType),
    "generateFieldSchema": (()=>generateFieldSchema),
    "generateStructuredDiff": (()=>generateStructuredDiff),
    "isEmptyValue": (()=>isEmptyValue)
});
function determineChangeType(leftValue, rightValue) {
    const leftEmpty = isEmptyValue(leftValue);
    const rightEmpty = isEmptyValue(rightValue);
    if (leftEmpty && rightEmpty) return 'NOT_SET';
    if (leftEmpty && !rightEmpty) return 'ADDED';
    if (!leftEmpty && rightEmpty) return 'REMOVED';
    if (deepEqual(leftValue, rightValue)) return 'UNCHANGED';
    return 'MODIFIED';
}
function isEmptyValue(value) {
    return value === null || value === undefined || value === '' || Array.isArray(value) && value.length === 0 || typeof value === 'object' && value !== null && Object.keys(value).length === 0;
}
function deepEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return a === b;
    if (typeof a !== typeof b) return false;
    if (typeof a === 'object') {
        if (Array.isArray(a) !== Array.isArray(b)) return false;
        if (Array.isArray(a)) {
            if (a.length !== b.length) return false;
            return a.every((val, index)=>deepEqual(val, b[index]));
        }
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        if (keysA.length !== keysB.length) return false;
        return keysA.every((key)=>keysB.includes(key) && deepEqual(a[key], b[key]));
    }
    return false;
}
function generateFieldSchema(sampleData) {
    const schema = [];
    if (!sampleData || typeof sampleData !== 'object') {
        return schema;
    }
    // Extract all fields and sort them for consistent ordering
    const fieldNames = Object.keys(sampleData).sort();
    for (const fieldName of fieldNames){
        // Skip metadata fields
        if ([
            'success',
            'version_number',
            'performance',
            'created_on',
            'created_by',
            'change_summary'
        ].includes(fieldName)) {
            continue;
        }
        const value = sampleData[fieldName];
        const fieldSchema = createFieldSchema(fieldName, fieldName, value);
        schema.push(fieldSchema);
    }
    return schema;
}
/**
 * Create schema for a single field based on its value
 */ function createFieldSchema(key, path, value) {
    const schema = {
        key,
        path,
        type: inferFieldType(value),
        label: formatFieldLabel(key)
    };
    // Handle nested objects
    if (schema.type === 'object' && value && typeof value === 'object' && !Array.isArray(value)) {
        schema.children = Object.keys(value).sort().map((childKey)=>createFieldSchema(childKey, `${path}.${childKey}`, value[childKey]));
    }
    // Handle arrays
    if (schema.type === 'array' && Array.isArray(value) && value.length > 0) {
        const firstItem = value[0];
        if (typeof firstItem === 'object' && firstItem !== null) {
            schema.itemSchema = Object.keys(firstItem).sort().map((itemKey)=>createFieldSchema(itemKey, `${path}[].${itemKey}`, firstItem[itemKey]));
        }
    }
    return schema;
}
/**
 * Infer field type from value
 */ function inferFieldType(value) {
    if (value === null || value === undefined) return 'string'; // Default for empty values
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'number') return 'number';
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'object') return 'object';
    return 'string';
}
/**
 * Format field name for display
 */ function formatFieldLabel(fieldName) {
    return fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, (str)=>str.toUpperCase()).replace(/_/g, ' ').trim();
}
function generateStructuredDiff(leftVersion, rightVersion, schema) {
    // Extract metadata from version responses
    const leftData = leftVersion?.metadata || leftVersion || {};
    const rightData = rightVersion?.metadata || rightVersion || {};
    // Generate schema if not provided
    const fieldSchema = schema || generateFieldSchema({
        ...leftData,
        ...rightData
    });
    return processSchemaFields(leftData, rightData, fieldSchema);
}
/**
 * Process all schema fields to ensure complete visibility
 */ function processSchemaFields(leftData, rightData, schemaFields) {
    return schemaFields.map((field)=>{
        const leftValue = getFieldValue(leftData, field.path);
        const rightValue = getFieldValue(rightData, field.path);
        return generateFieldDiff(field, leftValue, rightValue);
    });
}
/**
 * Get field value using dot notation path
 */ function getFieldValue(data, path) {
    if (!data || !path) return null;
    const keys = path.split('.');
    let value = data;
    for (const key of keys){
        if (value && typeof value === 'object' && key in value) {
            value = value[key];
        } else {
            return null;
        }
    }
    return value;
}
/**
 * Generate diff result for a single field
 */ function generateFieldDiff(field, leftValue, rightValue) {
    const changeType = determineChangeType(leftValue, rightValue);
    if (field.type === 'object') {
        return processNestedObject(field, leftValue, rightValue);
    } else if (field.type === 'array') {
        return processArrayField(field, leftValue, rightValue);
    } else {
        return processPrimitiveField(field, leftValue, rightValue, changeType);
    }
}
/**
 * Process primitive field comparison
 */ function processPrimitiveField(field, leftValue, rightValue, changeType) {
    return {
        fieldPath: field.path,
        changeType,
        leftValue,
        rightValue
    };
}
/**
 * Process nested object field comparison
 */ function processNestedObject(field, leftValue, rightValue) {
    const children = field.children?.map((childField)=>{
        const leftChild = leftValue?.[childField.key] ?? null;
        const rightChild = rightValue?.[childField.key] ?? null;
        return generateFieldDiff(childField, leftChild, rightChild);
    }) || [];
    const hasNestedChanges = children.some((child)=>child.changeType !== 'UNCHANGED' && child.changeType !== 'NOT_SET');
    const changeType = determineChangeType(leftValue, rightValue);
    return {
        fieldPath: field.path,
        changeType: hasNestedChanges ? 'MODIFIED' : changeType,
        leftValue,
        rightValue,
        hasNestedChanges,
        children
    };
}
/**
 * Process array field comparison with index-based strategy
 */ function processArrayField(field, leftArray, rightArray) {
    const leftArr = leftArray || [];
    const rightArr = rightArray || [];
    const maxLength = Math.max(leftArr.length, rightArr.length);
    const children = [];
    for(let i = 0; i < maxLength; i++){
        const leftItem = i < leftArr.length ? leftArr[i] : null;
        const rightItem = i < rightArr.length ? rightArr[i] : null;
        const itemDiff = {
            fieldPath: `${field.path}[${i}]`,
            changeType: determineChangeType(leftItem, rightItem),
            leftValue: leftItem,
            rightValue: rightItem
        };
        // Process nested object properties within array items
        if (field.itemSchema && (leftItem || rightItem)) {
            itemDiff.children = field.itemSchema.map((itemFieldSchema)=>{
                const leftProp = leftItem?.[itemFieldSchema.key] ?? null;
                const rightProp = rightItem?.[itemFieldSchema.key] ?? null;
                return {
                    fieldPath: `${field.path}[${i}].${itemFieldSchema.key}`,
                    changeType: determineChangeType(leftProp, rightProp),
                    leftValue: leftProp,
                    rightValue: rightProp
                };
            });
            // Check if any nested properties changed
            const hasNestedChanges = itemDiff.children.some((child)=>child.changeType !== 'UNCHANGED' && child.changeType !== 'NOT_SET');
            if (hasNestedChanges && itemDiff.changeType === 'UNCHANGED') {
                itemDiff.changeType = 'MODIFIED';
                itemDiff.hasNestedChanges = true;
            }
        }
        children.push(itemDiff);
    }
    const hasChanges = children.some((child)=>child.changeType !== 'UNCHANGED' && child.changeType !== 'NOT_SET');
    return {
        fieldPath: field.path,
        changeType: hasChanges ? 'MODIFIED' : determineChangeType(leftArr, rightArr),
        leftValue: leftArr,
        rightValue: rightArr,
        hasNestedChanges: hasChanges,
        children
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/tools/editor/components/ArrayComparisonModal.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "ArrayComparisonModal": (()=>ArrayComparisonModal)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function ArrayComparisonModal({ isOpen, fieldName, fieldPath, leftArray, rightArray, leftVersion, rightVersion, leftCellLine, rightCellLine, onClose }) {
    _s();
    // Handle escape key
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ArrayComparisonModal.useEffect": ()=>{
            if (!isOpen) return;
            const handleEscapeKey = {
                "ArrayComparisonModal.useEffect.handleEscapeKey": (e)=>{
                    if (e.key === 'Escape') {
                        onClose();
                    }
                }
            }["ArrayComparisonModal.useEffect.handleEscapeKey"];
            document.addEventListener('keydown', handleEscapeKey);
            return ({
                "ArrayComparisonModal.useEffect": ()=>document.removeEventListener('keydown', handleEscapeKey)
            })["ArrayComparisonModal.useEffect"];
        }
    }["ArrayComparisonModal.useEffect"], [
        isOpen,
        onClose
    ]);
    // Lock body scroll when modal is open
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ArrayComparisonModal.useEffect": ()=>{
            if (!isOpen) return;
            const originalStyle = window.getComputedStyle(document.body).overflow;
            document.body.style.overflow = 'hidden';
            return ({
                "ArrayComparisonModal.useEffect": ()=>{
                    document.body.style.overflow = originalStyle;
                }
            })["ArrayComparisonModal.useEffect"];
        }
    }["ArrayComparisonModal.useEffect"], [
        isOpen
    ]);
    // Handle backdrop click
    const handleBackdropClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ArrayComparisonModal.useCallback[handleBackdropClick]": (e)=>{
            if (e.target === e.currentTarget) {
                onClose();
            }
        }
    }["ArrayComparisonModal.useCallback[handleBackdropClick]"], [
        onClose
    ]);
    // Analyze array differences
    const diffAnalysis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ArrayComparisonModal.useCallback[diffAnalysis]": ()=>{
            return analyzeArrayDifferences(leftArray || [], rightArray || []);
        }
    }["ArrayComparisonModal.useCallback[diffAnalysis]"], [
        leftArray,
        rightArray
    ]);
    const analysis = diffAnalysis();
    if (!isOpen) return null;
    const modalContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed z-[9999] inset-0",
        role: "dialog",
        tabIndex: -1,
        "aria-labelledby": "array-comparison-modal-title",
        onClick: handleBackdropClick,
        style: {
            position: 'fixed',
            top: 0,
            left: '280px',
            right: 0,
            bottom: 0
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-200 shadow-2xl rounded-xl w-full max-w-6xl max-h-[90vh] flex flex-col",
            onClick: (e)=>e.stopPropagation(),
            style: {
                backgroundColor: 'white'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "py-4 px-6 border-b border-gray-200",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        id: "array-comparison-modal-title",
                        className: "text-lg text-gray-800",
                        children: fieldName
                    }, void 0, false, {
                        fileName: "[project]/src/app/tools/editor/components/ArrayComparisonModal.tsx",
                        lineNumber: 109,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/tools/editor/components/ArrayComparisonModal.tsx",
                    lineNumber: 108,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 p-6 overflow-hidden",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ArrayDiffViewer, {
                        leftArray: leftArray || [],
                        rightArray: rightArray || [],
                        leftCellLine: leftCellLine,
                        leftVersion: leftVersion,
                        rightCellLine: rightCellLine,
                        rightVersion: rightVersion,
                        analysis: analysis
                    }, void 0, false, {
                        fileName: "[project]/src/app/tools/editor/components/ArrayComparisonModal.tsx",
                        lineNumber: 116,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/tools/editor/components/ArrayComparisonModal.tsx",
                    lineNumber: 115,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/tools/editor/components/ArrayComparisonModal.tsx",
            lineNumber: 102,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/tools/editor/components/ArrayComparisonModal.tsx",
        lineNumber: 87,
        columnNumber: 5
    }, this);
    // Use Portal to render the modal directly to document.body
    return ("TURBOPACK compile-time truthy", 1) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(modalContent, document.body) : ("TURBOPACK unreachable", undefined);
}
_s(ArrayComparisonModal, "DaKn2TNoDnyfAsBnzN11ruRY8tw=");
_c = ArrayComparisonModal;
function ArrayDiffViewer({ leftArray, rightArray, leftCellLine, leftVersion, rightCellLine, rightVersion, analysis }) {
    const maxLength = Math.max(leftArray.length, rightArray.length);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "array-diff-viewer h-full flex flex-col",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex-1 grid grid-cols-2 gap-6 overflow-hidden",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col border border-gray-200 rounded-lg",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-4 py-3 bg-gray-50 border-b border-gray-200 rounded-t-lg",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: "text-sm font-semibold text-gray-700",
                                children: [
                                    leftCellLine,
                                    " (v",
                                    leftVersion,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/tools/editor/components/ArrayComparisonModal.tsx",
                                lineNumber: 157,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/tools/editor/components/ArrayComparisonModal.tsx",
                            lineNumber: 156,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 overflow-y-auto",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ArrayItemList, {
                                items: leftArray,
                                analysis: analysis,
                                side: "left",
                                maxLength: maxLength
                            }, void 0, false, {
                                fileName: "[project]/src/app/tools/editor/components/ArrayComparisonModal.tsx",
                                lineNumber: 162,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/tools/editor/components/ArrayComparisonModal.tsx",
                            lineNumber: 161,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/tools/editor/components/ArrayComparisonModal.tsx",
                    lineNumber: 155,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col border border-gray-200 rounded-lg",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-4 py-3 bg-gray-50 border-b border-gray-200 rounded-t-lg",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: "text-sm font-semibold text-gray-700",
                                children: [
                                    rightCellLine,
                                    " (v",
                                    rightVersion,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/tools/editor/components/ArrayComparisonModal.tsx",
                                lineNumber: 174,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/tools/editor/components/ArrayComparisonModal.tsx",
                            lineNumber: 173,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 overflow-y-auto",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ArrayItemList, {
                                items: rightArray,
                                analysis: analysis,
                                side: "right",
                                maxLength: maxLength
                            }, void 0, false, {
                                fileName: "[project]/src/app/tools/editor/components/ArrayComparisonModal.tsx",
                                lineNumber: 179,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/tools/editor/components/ArrayComparisonModal.tsx",
                            lineNumber: 178,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/tools/editor/components/ArrayComparisonModal.tsx",
                    lineNumber: 172,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/tools/editor/components/ArrayComparisonModal.tsx",
            lineNumber: 153,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/tools/editor/components/ArrayComparisonModal.tsx",
        lineNumber: 151,
        columnNumber: 5
    }, this);
}
_c1 = ArrayDiffViewer;
function ArrayItemList({ items, analysis, side, maxLength }) {
    const getDifferenceType = (index)=>{
        // Check if item was added
        const isAdded = analysis.added.some((a)=>a.index === index);
        if (isAdded && side === 'right') return 'added';
        // Check if item was removed
        const isRemoved = analysis.removed.some((r)=>r.index === index);
        if (isRemoved && side === 'left') return 'removed';
        // Check if item was modified
        const isModified = side === 'left' ? analysis.modified.some((m)=>m.leftIndex === index) : analysis.modified.some((m)=>m.rightIndex === index);
        if (isModified) return 'modified';
        // Check if item is unchanged
        const isUnchanged = side === 'left' ? analysis.unchanged.some((u)=>u.leftIndex === index) : analysis.unchanged.some((u)=>u.rightIndex === index);
        if (isUnchanged) return 'unchanged';
        return 'unchanged';
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "array-item-list p-2",
        children: Array.from({
            length: maxLength
        }, (_, index)=>{
            const item = items[index];
            const diffType = getDifferenceType(index);
            const isEmpty = item === undefined;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `array-item flex items-start gap-3 p-3 mb-2 rounded-md border ${getItemStyling(diffType, isEmpty)}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "item-index text-xs font-mono text-gray-500 flex-shrink-0 min-w-[40px]",
                        children: [
                            "[",
                            index,
                            "]:"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/tools/editor/components/ArrayComparisonModal.tsx",
                        lineNumber: 239,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "item-content flex-1 text-sm",
                        children: isEmpty ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-gray-400 italic",
                            children: "[Not present]"
                        }, void 0, false, {
                            fileName: "[project]/src/app/tools/editor/components/ArrayComparisonModal.tsx",
                            lineNumber: 244,
                            columnNumber: 17
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ItemRenderer, {
                            item: item
                        }, void 0, false, {
                            fileName: "[project]/src/app/tools/editor/components/ArrayComparisonModal.tsx",
                            lineNumber: 246,
                            columnNumber: 17
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/tools/editor/components/ArrayComparisonModal.tsx",
                        lineNumber: 242,
                        columnNumber: 13
                    }, this),
                    diffType !== 'unchanged' && !isEmpty && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DifferenceLabel, {
                        type: diffType
                    }, void 0, false, {
                        fileName: "[project]/src/app/tools/editor/components/ArrayComparisonModal.tsx",
                        lineNumber: 250,
                        columnNumber: 15
                    }, this)
                ]
            }, index, true, {
                fileName: "[project]/src/app/tools/editor/components/ArrayComparisonModal.tsx",
                lineNumber: 235,
                columnNumber: 11
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/src/app/tools/editor/components/ArrayComparisonModal.tsx",
        lineNumber: 228,
        columnNumber: 5
    }, this);
}
_c2 = ArrayItemList;
function ItemRenderer({ item }) {
    const renderValue = (value)=>{
        if (value === null || value === undefined) {
            return '[NOT SET]';
        }
        if (typeof value === 'string') {
            return value;
        }
        if (typeof value === 'object') {
            return JSON.stringify(value, null, 2);
        }
        return String(value);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
        className: "whitespace-pre-wrap font-mono text-xs leading-relaxed",
        children: renderValue(item)
    }, void 0, false, {
        fileName: "[project]/src/app/tools/editor/components/ArrayComparisonModal.tsx",
        lineNumber: 284,
        columnNumber: 5
    }, this);
}
_c3 = ItemRenderer;
function DifferenceLabel({ type }) {
    const labels = {
        added: {
            text: 'Added',
            class: 'bg-green-100 text-green-800'
        },
        removed: {
            text: 'Removed',
            class: 'bg-red-100 text-red-800'
        },
        modified: {
            text: 'Modified',
            class: 'bg-orange-100 text-orange-800'
        },
        unchanged: {
            text: 'Unchanged',
            class: 'bg-gray-100 text-gray-600'
        }
    };
    const label = labels[type] || labels.unchanged;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `px-2 py-1 text-xs rounded-full ${label.class}`,
        children: label.text
    }, void 0, false, {
        fileName: "[project]/src/app/tools/editor/components/ArrayComparisonModal.tsx",
        lineNumber: 308,
        columnNumber: 5
    }, this);
}
_c4 = DifferenceLabel;
/**
 * Helper Functions
 */ function analyzeArrayDifferences(leftArray, rightArray) {
    const analysis = {
        added: [],
        removed: [],
        modified: [],
        unchanged: [],
        summary: {
            totalChanges: 0,
            addedCount: 0,
            removedCount: 0,
            modifiedCount: 0
        }
    };
    const maxLength = Math.max(leftArray.length, rightArray.length);
    for(let i = 0; i < maxLength; i++){
        const leftItem = leftArray[i];
        const rightItem = rightArray[i];
        const leftExists = i < leftArray.length;
        const rightExists = i < rightArray.length;
        if (!leftExists && rightExists) {
            // Item added in right
            analysis.added.push({
                index: i,
                item: rightItem
            });
            analysis.summary.addedCount++;
        } else if (leftExists && !rightExists) {
            // Item removed from left
            analysis.removed.push({
                index: i,
                item: leftItem
            });
            analysis.summary.removedCount++;
        } else if (leftExists && rightExists) {
            // Both exist, check if modified
            if (!deepEqual(leftItem, rightItem)) {
                analysis.modified.push({
                    leftIndex: i,
                    rightIndex: i,
                    leftItem,
                    rightItem
                });
                analysis.summary.modifiedCount++;
            } else {
                analysis.unchanged.push({
                    leftIndex: i,
                    rightIndex: i,
                    item: leftItem
                });
            }
        }
    }
    analysis.summary.totalChanges = analysis.summary.addedCount + analysis.summary.removedCount + analysis.summary.modifiedCount;
    return analysis;
}
function deepEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return a === b;
    if (typeof a !== typeof b) return false;
    if (typeof a === 'object') {
        if (Array.isArray(a) !== Array.isArray(b)) return false;
        if (Array.isArray(a)) {
            if (a.length !== b.length) return false;
            return a.every((item, index)=>deepEqual(item, b[index]));
        }
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        if (keysA.length !== keysB.length) return false;
        return keysA.every((key)=>deepEqual(a[key], b[key]));
    }
    return false;
}
function getItemStyling(diffType, isEmpty) {
    if (isEmpty) {
        return 'border-gray-200 bg-gray-50';
    }
    switch(diffType){
        case 'added':
            return 'border-green-200 bg-green-50';
        case 'removed':
            return 'border-red-200 bg-red-50';
        case 'modified':
            return 'border-orange-200 bg-orange-50';
        default:
            return 'border-gray-200 bg-white';
    }
}
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "ArrayComparisonModal");
__turbopack_context__.k.register(_c1, "ArrayDiffViewer");
__turbopack_context__.k.register(_c2, "ArrayItemList");
__turbopack_context__.k.register(_c3, "ItemRenderer");
__turbopack_context__.k.register(_c4, "DifferenceLabel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/tools/editor/hooks/useArrayModal.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "useArrayModal": (()=>useArrayModal)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
function useArrayModal(contextData) {
    _s();
    const [modalState, setModalState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        isOpen: false,
        fieldName: '',
        fieldPath: '',
        leftArray: [],
        rightArray: [],
        leftVersion: '',
        rightVersion: '',
        leftCellLine: '',
        rightCellLine: ''
    });
    const openModal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useArrayModal.useCallback[openModal]": (fieldPath, leftArray, rightArray, fieldName, additionalContext)=>{
            setModalState({
                isOpen: true,
                fieldPath,
                fieldName,
                leftArray: leftArray || [],
                rightArray: rightArray || [],
                leftVersion: additionalContext?.leftVersion || contextData?.leftVersionId || 'Unknown',
                rightVersion: additionalContext?.rightVersion || contextData?.rightVersionId || 'Unknown',
                leftCellLine: additionalContext?.leftCellLine || contextData?.leftCellLineId || 'Unknown',
                rightCellLine: additionalContext?.rightCellLine || contextData?.rightCellLineId || 'Unknown'
            });
        }
    }["useArrayModal.useCallback[openModal]"], [
        contextData
    ]);
    const closeModal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useArrayModal.useCallback[closeModal]": ()=>{
            setModalState({
                "useArrayModal.useCallback[closeModal]": (prev)=>({
                        ...prev,
                        isOpen: false
                    })
            }["useArrayModal.useCallback[closeModal]"]);
        }
    }["useArrayModal.useCallback[closeModal]"], []);
    return {
        modalState,
        openModal,
        closeModal
    };
}
_s(useArrayModal, "+6oX/CN+UBMogZoNMYTq3zuF6Vc=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/tools/editor/components/DiffField.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "DiffField": (()=>DiffField)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$components$2f$ArrayComparisonModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tools/editor/components/ArrayComparisonModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$hooks$2f$useArrayModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tools/editor/hooks/useArrayModal.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function DiffField({ diffResult, isExpanded = false, onToggleExpansion, indentLevel = 0, showDifferencesOnly, isVirtualized = false, leftCellLine, leftVersion, rightCellLine, rightVersion }) {
    _s();
    const { fieldPath, changeType, leftValue, rightValue, children } = diffResult;
    // Get the field name (last part of the path)
    const fieldName = fieldPath.split('.').pop() || fieldPath;
    // Check if this is an array field
    const isArray = Array.isArray(leftValue) || Array.isArray(rightValue);
    // Check if this is a nested object (has children)
    const isNested = children && children.length > 0;
    // Check if field is incomplete (both values are empty/null/undefined)
    const isFieldEmpty = (value)=>value === null || value === undefined || value === '';
    const isIncomplete = isFieldEmpty(leftValue) && isFieldEmpty(rightValue);
    // Get highlight class based on change type, but override for incomplete fields
    const highlightClass = isIncomplete ? 'diff-incomplete' : getHighlightClass(changeType);
    // Create context data for array modal
    const contextData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DiffField.useMemo[contextData]": ()=>({
                leftVersionId: leftVersion || undefined,
                rightVersionId: rightVersion || undefined,
                leftCellLineId: leftCellLine || undefined,
                rightCellLineId: rightCellLine || undefined
            })
    }["DiffField.useMemo[contextData]"], [
        leftVersion,
        rightVersion,
        leftCellLine,
        rightCellLine
    ]);
    const { modalState, openModal, closeModal } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$hooks$2f$useArrayModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useArrayModal"])(contextData);
    // Handle array fields with modal-based comparison
    if (isArray) {
        const leftArray = Array.isArray(leftValue) ? leftValue : [];
        const rightArray = Array.isArray(rightValue) ? rightValue : [];
        const hasChanges = !arraysEqual(leftArray, rightArray);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `diff-field ${highlightClass} ${isVirtualized ? 'virtualized-item' : ''}`,
                    style: {
                        marginLeft: `${indentLevel * 12}px`
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "field-row p-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "field-layout",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "field-content",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "field-name-row",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "field-name",
                                            children: [
                                                fieldName,
                                                " (Array)"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/tools/editor/components/DiffField.tsx",
                                            lineNumber: 75,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/tools/editor/components/DiffField.tsx",
                                        lineNumber: 74,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "field-values-row",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {}, void 0, false, {
                                                fileName: "[project]/src/app/tools/editor/components/DiffField.tsx",
                                                lineNumber: 79,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {}, void 0, false, {
                                                fileName: "[project]/src/app/tools/editor/components/DiffField.tsx",
                                                lineNumber: 81,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>openModal(fieldPath, leftArray, rightArray, fieldName),
                                                className: "field-value-container right-value w-full h-full flex justify-end items-center text-sm font-medium text-gray-900 hover:text-black hover:bg-blue-100 transition-all duration-150 focus:outline-none cursor-pointer",
                                                children: [
                                                    "View comparison →",
                                                    hasChanges && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "ml-2 inline-flex items-center gap-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-2 h-2 bg-orange-400 rounded-full"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/tools/editor/components/DiffField.tsx",
                                                                lineNumber: 90,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xs text-orange-600 font-medium",
                                                                children: "Changes"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/tools/editor/components/DiffField.tsx",
                                                                lineNumber: 91,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/tools/editor/components/DiffField.tsx",
                                                        lineNumber: 89,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/tools/editor/components/DiffField.tsx",
                                                lineNumber: 83,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/tools/editor/components/DiffField.tsx",
                                        lineNumber: 77,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/tools/editor/components/DiffField.tsx",
                                lineNumber: 73,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/tools/editor/components/DiffField.tsx",
                            lineNumber: 72,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/tools/editor/components/DiffField.tsx",
                        lineNumber: 71,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/tools/editor/components/DiffField.tsx",
                    lineNumber: 69,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$components$2f$ArrayComparisonModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ArrayComparisonModal"], {
                    isOpen: modalState.isOpen,
                    fieldName: modalState.fieldName,
                    fieldPath: modalState.fieldPath,
                    leftArray: modalState.leftArray,
                    rightArray: modalState.rightArray,
                    leftVersion: modalState.leftVersion,
                    rightVersion: modalState.rightVersion,
                    leftCellLine: modalState.leftCellLine,
                    rightCellLine: modalState.rightCellLine,
                    onClose: closeModal
                }, void 0, false, {
                    fileName: "[project]/src/app/tools/editor/components/DiffField.tsx",
                    lineNumber: 102,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `diff-field ${highlightClass} ${isVirtualized ? 'virtualized-item' : ''} ${isIncomplete ? 'incomplete-field' : ''}`,
        style: {
            marginLeft: `${indentLevel * 12}px`
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "field-row p-2",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "field-layout",
                    children: [
                        isNested && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "expansion-section",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onToggleExpansion,
                                className: "expansion-indicator text-gray-600 hover:text-gray-800 focus:outline-none p-1",
                                "aria-label": isExpanded ? `Collapse ${fieldName}` : `Expand ${fieldName}`,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: `transform transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`,
                                    children: "▶"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/tools/editor/components/DiffField.tsx",
                                    lineNumber: 132,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/tools/editor/components/DiffField.tsx",
                                lineNumber: 127,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/tools/editor/components/DiffField.tsx",
                            lineNumber: 126,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "field-content",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "field-name-row",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `field-name ${isIncomplete ? 'text-gray-400' : ''}`,
                                        children: fieldName
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/tools/editor/components/DiffField.tsx",
                                        lineNumber: 142,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/tools/editor/components/DiffField.tsx",
                                    lineNumber: 141,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "field-values-row",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {}, void 0, false, {
                                            fileName: "[project]/src/app/tools/editor/components/DiffField.tsx",
                                            lineNumber: 146,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "field-value-container left-value",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "field-value field-text-content",
                                                children: formatFieldValue(leftValue)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/tools/editor/components/DiffField.tsx",
                                                lineNumber: 150,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/tools/editor/components/DiffField.tsx",
                                            lineNumber: 149,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "field-value-container right-value",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "field-value field-text-content",
                                                children: formatFieldValue(rightValue)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/tools/editor/components/DiffField.tsx",
                                                lineNumber: 157,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/tools/editor/components/DiffField.tsx",
                                            lineNumber: 156,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/tools/editor/components/DiffField.tsx",
                                    lineNumber: 144,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/tools/editor/components/DiffField.tsx",
                            lineNumber: 140,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/tools/editor/components/DiffField.tsx",
                    lineNumber: 123,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/tools/editor/components/DiffField.tsx",
                lineNumber: 122,
                columnNumber: 7
            }, this),
            isNested && isExpanded && !isVirtualized && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "nested-children ml-6 border-l border-gray-200 pl-3",
                children: children.map((childDiff)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DiffField, {
                        diffResult: childDiff,
                        indentLevel: indentLevel + 1,
                        showDifferencesOnly: showDifferencesOnly,
                        isVirtualized: isVirtualized,
                        leftCellLine: leftCellLine,
                        leftVersion: leftVersion,
                        rightCellLine: rightCellLine,
                        rightVersion: rightVersion
                    }, childDiff.fieldPath, false, {
                        fileName: "[project]/src/app/tools/editor/components/DiffField.tsx",
                        lineNumber: 170,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/app/tools/editor/components/DiffField.tsx",
                lineNumber: 168,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/tools/editor/components/DiffField.tsx",
        lineNumber: 119,
        columnNumber: 5
    }, this);
}
_s(DiffField, "bxE76GZRNHxuBuA/IciT60N9KV4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$hooks$2f$useArrayModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useArrayModal"]
    ];
});
_c = DiffField;
/**
 * Format a value for display - Enhanced for full content visibility
 */ function formatFieldValue(value) {
    if (value === null || value === undefined || value === '') {
        return ''; // Empty cell instead of [NOT SET]
    }
    if (typeof value === 'string') {
        return value; // No truncation - show full string content
    }
    if (typeof value === 'number') {
        return value.toString();
    }
    if (typeof value === 'boolean') {
        return value ? 'true' : 'false';
    }
    if (Array.isArray(value)) {
        if (value.length === 0) {
            return '[]';
        }
        // Note: Array content will be handled by dedicated array display logic
        return `[${value.length} items]`;
    }
    if (typeof value === 'object') {
        const keys = Object.keys(value);
        if (keys.length === 0) {
            return '{}';
        }
        // Show full object content for simple objects with few fields
        if (keys.length <= 3) {
            const summary = keys.map((key)=>{
                const fieldValue = value[key];
                const displayValue = typeof fieldValue === 'string' ? fieldValue // No truncation for string values
                 : String(fieldValue);
                return `${key}: ${displayValue}`;
            }).join(', ');
            return `{ ${summary} }`;
        }
        return `{${keys.length} fields}`;
    }
    return String(value); // No truncation - show full content
}
/**
 * Helper function to compare arrays for equality
 */ function arraysEqual(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    return a.every((item, index)=>deepEqual(item, b[index]));
}
function deepEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return a === b;
    if (typeof a !== typeof b) return false;
    if (typeof a === 'object') {
        if (Array.isArray(a) !== Array.isArray(b)) return false;
        if (Array.isArray(a)) {
            if (a.length !== b.length) return false;
            return a.every((item, index)=>deepEqual(item, b[index]));
        }
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        if (keysA.length !== keysB.length) return false;
        return keysA.every((key)=>deepEqual(a[key], b[key]));
    }
    return false;
}
/**
 * Get CSS class for highlighting based on change type
 */ function getHighlightClass(changeType) {
    switch(changeType){
        case 'MODIFIED':
            return 'diff-modified';
        case 'ADDED':
            return 'diff-added';
        case 'REMOVED':
            return 'diff-removed';
        case 'NOT_SET':
            return 'diff-not-set';
        case 'UNCHANGED':
        default:
            return 'diff-unchanged';
    }
}
var _c;
__turbopack_context__.k.register(_c, "DiffField");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/tools/editor/hooks/useNestedObjectState.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "useNestedObjectState": (()=>useNestedObjectState)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
const useNestedObjectState = (defaultExpanded)=>{
    _s();
    const [expandedFields, setExpandedFields] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set(defaultExpanded || []));
    const toggleExpansion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useNestedObjectState.useCallback[toggleExpansion]": (fieldPath)=>{
            setExpandedFields({
                "useNestedObjectState.useCallback[toggleExpansion]": (prev)=>{
                    const newSet = new Set(prev);
                    if (newSet.has(fieldPath)) {
                        newSet.delete(fieldPath);
                    } else {
                        newSet.add(fieldPath);
                    }
                    return newSet;
                }
            }["useNestedObjectState.useCallback[toggleExpansion]"]);
        }
    }["useNestedObjectState.useCallback[toggleExpansion]"], []);
    const isExpanded = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useNestedObjectState.useCallback[isExpanded]": (fieldPath)=>{
            return expandedFields.has(fieldPath);
        }
    }["useNestedObjectState.useCallback[isExpanded]"], [
        expandedFields
    ]);
    const expandAll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useNestedObjectState.useCallback[expandAll]": ()=>{
            // This would need to be called with all available field paths
            // For now, we'll implement a simple version
            setExpandedFields(new Set());
        }
    }["useNestedObjectState.useCallback[expandAll]"], []);
    const collapseAll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useNestedObjectState.useCallback[collapseAll]": ()=>{
            setExpandedFields(new Set());
        }
    }["useNestedObjectState.useCallback[collapseAll]"], []);
    const setExpanded = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useNestedObjectState.useCallback[setExpanded]": (fieldPath, expanded)=>{
            setExpandedFields({
                "useNestedObjectState.useCallback[setExpanded]": (prev)=>{
                    const newSet = new Set(prev);
                    if (expanded) {
                        newSet.add(fieldPath);
                    } else {
                        newSet.delete(fieldPath);
                    }
                    return newSet;
                }
            }["useNestedObjectState.useCallback[setExpanded]"]);
        }
    }["useNestedObjectState.useCallback[setExpanded]"], []);
    return {
        expandedFields,
        toggleExpansion,
        isExpanded,
        expandAll,
        collapseAll,
        setExpanded
    };
};
_s(useNestedObjectState, "Bn7sO84rMblNBrZ1Hil7kyvgiXo=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/tools/editor/utils/cacheManager.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// @ts-ignore - LRU cache types may not be fully compatible
__turbopack_context__.s({
    "CacheManager": (()=>CacheManager),
    "cacheManager": (()=>cacheManager)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lru$2d$cache$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lru-cache/index.mjs [app-client] (ecmascript)");
;
class CacheManager {
    versionCache;
    diffCache;
    schemaCache;
    fetchPromises;
    // Performance tracking
    versionHits = 0;
    versionMisses = 0;
    diffHits = 0;
    diffMisses = 0;
    constructor(versionCacheSize = 50, diffCacheSize = 30, cacheTTL = 600000 // 10 minutes
    ){
        this.versionCache = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lru$2d$cache$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]({
            max: versionCacheSize,
            ttl: cacheTTL,
            sizeCalculation: (entry)=>{
                // Estimate memory usage
                return JSON.stringify(entry.data).length * 2; // UTF-16 factor
            },
            maxSize: 100 * 1024 * 1024
        });
        this.diffCache = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lru$2d$cache$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]({
            max: diffCacheSize,
            ttl: cacheTTL,
            sizeCalculation: (entry)=>{
                return JSON.stringify(entry.diff).length * 2;
            },
            maxSize: 50 * 1024 * 1024
        });
        this.schemaCache = new Map();
        this.fetchPromises = new Map();
        // Cleanup interval
        if ("TURBOPACK compile-time truthy", 1) {
            setInterval(()=>this.cleanup(), 60000); // Every minute
        }
    }
    /**
   * Get version data with caching and deduplication
   */ async getVersion(cellLineId, versionId) {
        const cacheKey = `${cellLineId}:${versionId}`;
        // Check cache first
        const cached = this.versionCache.get(cacheKey);
        if (cached) {
            this.versionHits++;
            return cached.data;
        }
        this.versionMisses++;
        // Check for in-flight request to prevent duplicate fetches
        const existingPromise = this.fetchPromises.get(cacheKey);
        if (existingPromise) {
            return existingPromise;
        }
        // Create fetch promise
        const fetchPromise = this.fetchVersionFromAPI(cellLineId, versionId).then((data)=>{
            // Cache the result
            this.versionCache.set(cacheKey, {
                data,
                timestamp: Date.now()
            });
            // Remove from in-flight promises
            this.fetchPromises.delete(cacheKey);
            return data;
        }).catch((error)=>{
            // Remove from in-flight promises on error
            this.fetchPromises.delete(cacheKey);
            throw error;
        });
        this.fetchPromises.set(cacheKey, fetchPromise);
        return fetchPromise;
    }
    /**
   * Get diff result with bidirectional caching
   */ getDiff(leftVersionId, rightVersionId) {
        const cacheKey = this.getDiffCacheKey(leftVersionId, rightVersionId);
        const cached = this.diffCache.get(cacheKey);
        if (cached) {
            this.diffHits++;
            return cached.diff;
        }
        this.diffMisses++;
        return null;
    }
    /**
   * Store diff result in cache
   */ setDiff(leftVersionId, rightVersionId, diff) {
        const cacheKey = this.getDiffCacheKey(leftVersionId, rightVersionId);
        this.diffCache.set(cacheKey, {
            diff,
            timestamp: Date.now()
        });
    }
    /**
   * Get or set schema data
   */ getSchema(schemaKey) {
        const entry = this.schemaCache.get(schemaKey);
        if (entry && Date.now() - entry.timestamp < 3600000) {
            return entry.schema;
        }
        return null;
    }
    setSchema(schemaKey, schema) {
        this.schemaCache.set(schemaKey, {
            schema,
            timestamp: Date.now()
        });
    }
    /**
   * Invalidate cache entries
   */ invalidateVersion(cellLineId, versionId) {
        if (!cellLineId) {
            this.versionCache.clear();
            return;
        }
        if (versionId) {
            const key = `${cellLineId}:${versionId}`;
            this.versionCache.delete(key);
            this.fetchPromises.delete(key);
        } else {
            // Invalidate all versions for this cell line
            const keysToDelete = [];
            for (const key of this.versionCache.keys()){
                if (key.startsWith(`${cellLineId}:`)) {
                    keysToDelete.push(key);
                }
            }
            keysToDelete.forEach((key)=>{
                this.versionCache.delete(key);
                this.fetchPromises.delete(key);
            });
        }
        // Also invalidate related diffs
        this.invalidateDiffByVersion(versionId || cellLineId);
    }
    /**
   * Invalidate diff cache entries involving a specific version
   */ invalidateDiffByVersion(versionId) {
        const keysToDelete = [];
        for (const key of this.diffCache.keys()){
            if (key.includes(versionId)) {
                keysToDelete.push(key);
            }
        }
        keysToDelete.forEach((key)=>this.diffCache.delete(key));
    }
    /**
   * Get comprehensive cache statistics
   */ getStats() {
        const versionTotal = this.versionHits + this.versionMisses;
        const diffTotal = this.diffHits + this.diffMisses;
        return {
            versionCache: {
                size: this.versionCache.size,
                maxSize: this.versionCache.max,
                hitCount: this.versionHits,
                missCount: this.versionMisses,
                hitRate: versionTotal > 0 ? this.versionHits / versionTotal : 0
            },
            diffCache: {
                size: this.diffCache.size,
                maxSize: this.diffCache.max,
                hitCount: this.diffHits,
                missCount: this.diffMisses,
                hitRate: diffTotal > 0 ? this.diffHits / diffTotal : 0
            },
            totalMemoryUsage: this.versionCache.calculatedSize + this.diffCache.calculatedSize
        };
    }
    /**
   * Clear all caches
   */ clearAll() {
        this.versionCache.clear();
        this.diffCache.clear();
        this.schemaCache.clear();
        this.fetchPromises.clear();
        // Reset statistics
        this.versionHits = 0;
        this.versionMisses = 0;
        this.diffHits = 0;
        this.diffMisses = 0;
    }
    /**
   * Generate normalized cache key for diff results
   */ getDiffCacheKey(leftVersionId, rightVersionId) {
        // Normalize order for bidirectional lookups
        return [
            leftVersionId,
            rightVersionId
        ].sort().join(':');
    }
    /**
   * Fetch version data from API
   */ async fetchVersionFromAPI(cellLineId, versionId) {
        const response = await fetch(`http://localhost:8000/api/editor/celllines/${cellLineId}/versions/${versionId}/`);
        if (!response.ok) {
            throw new Error(`Failed to fetch version: ${response.statusText}`);
        }
        const data = await response.json();
        return data.metadata || data;
    }
    /**
   * Cleanup expired entries and reset counters periodically
   */ cleanup() {
        // Clean expired schema entries
        const now = Date.now();
        for (const [key, entry] of this.schemaCache.entries()){
            if (now - entry.timestamp > 3600000) {
                this.schemaCache.delete(key);
            }
        }
        // Reset hit/miss counters every 10 minutes to prevent overflow
        if (Math.random() < 0.1) {
            this.versionHits = Math.floor(this.versionHits * 0.9);
            this.versionMisses = Math.floor(this.versionMisses * 0.9);
            this.diffHits = Math.floor(this.diffHits * 0.9);
            this.diffMisses = Math.floor(this.diffMisses * 0.9);
        }
    }
}
const cacheManager = new CacheManager();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/tools/editor/utils/performanceMonitor.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "PerformanceMonitor": (()=>PerformanceMonitor),
    "performanceMonitor": (()=>performanceMonitor)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
class PerformanceMonitor {
    entries = [];
    maxEntries = 1000;
    timingStack = new Map();
    operationCounts = new Map();
    isEnabled;
    // Performance targets from task requirements
    benchmarks = {
        versionLoadTime: 500,
        diffComputeTime: 200,
        renderTime: 300,
        versionSwitching: 200,
        scrollPerformance: 16,
        filterTime: 100
    };
    constructor(enabled = ("TURBOPACK compile-time value", "development") === 'development'){
        this.isEnabled = enabled;
        if (this.isEnabled && "object" !== 'undefined') {
            // Setup performance observer for paint timing
            this.setupPerformanceObserver();
            // Periodic memory monitoring
            setInterval(()=>this.recordMemoryUsage(), 5000);
        }
    }
    /**
   * Start timing an operation
   */ startTiming(operation, metadata) {
        if (!this.isEnabled) {
            return ()=>0;
        }
        const startTime = performance.now();
        const stackKey = `${operation}_${Date.now()}_${Math.random()}`;
        this.timingStack.set(stackKey, startTime);
        return ()=>{
            const endTime = performance.now();
            const duration = endTime - startTime;
            this.timingStack.delete(stackKey);
            this.recordTiming(operation, duration, metadata);
            return duration;
        };
    }
    /**
   * Record a timing measurement
   */ recordTiming(operation, duration, metadata) {
        if (!this.isEnabled) return;
        this.entries.push({
            timestamp: Date.now(),
            operation,
            duration,
            metadata
        });
        // Increment operation count
        this.operationCounts.set(operation, (this.operationCounts.get(operation) || 0) + 1);
        // Maintain max entries limit
        if (this.entries.length > this.maxEntries) {
            this.entries = this.entries.slice(-this.maxEntries);
        }
        // Log performance warnings
        this.checkPerformanceWarnings(operation, duration);
        // Development logging
        if ("TURBOPACK compile-time truthy", 1) {
            console.log(`⚡ Performance: ${operation} = ${duration.toFixed(2)}ms`, metadata);
        }
    }
    /**
   * Get average timing for an operation
   */ getAverageTiming(operation, timeWindow) {
        const cutoff = timeWindow ? Date.now() - timeWindow : 0;
        const relevantEntries = this.entries.filter((entry)=>entry.operation === operation && entry.timestamp > cutoff);
        if (relevantEntries.length === 0) return 0;
        const total = relevantEntries.reduce((sum, entry)=>sum + entry.duration, 0);
        return total / relevantEntries.length;
    }
    /**
   * Get performance percentiles for an operation
   */ getPercentiles(operation, percentiles = [
        50,
        90,
        95,
        99
    ]) {
        const durations = this.entries.filter((entry)=>entry.operation === operation).map((entry)=>entry.duration).sort((a, b)=>a - b);
        const result = {};
        percentiles.forEach((p)=>{
            const index = Math.ceil(p / 100 * durations.length) - 1;
            result[p] = durations[index] || 0;
        });
        return result;
    }
    /**
   * Get current performance metrics
   */ getCurrentMetrics() {
        const now = Date.now();
        const recentWindow = 60000; // Last minute
        return {
            versionLoadTime: this.getAverageTiming('versionLoad', recentWindow),
            diffComputeTime: this.getAverageTiming('diffCompute', recentWindow),
            renderTime: this.getAverageTiming('render', recentWindow),
            memoryUsage: this.getCurrentMemoryUsage(),
            cacheHitRate: this.getCacheHitRate(),
            scrollPerformance: this.getAverageTiming('scroll', recentWindow),
            filterTime: this.getAverageTiming('filter', recentWindow),
            componentMountTime: this.getAverageTiming('componentMount', recentWindow)
        };
    }
    /**
   * Get performance benchmarks with status
   */ getBenchmarks() {
        const metrics = this.getCurrentMetrics();
        return Object.entries(this.benchmarks).map(([name, target])=>{
            const current = metrics[name] || 0;
            let status = 'pass';
            if (current > target * 1.5) {
                status = 'fail';
            } else if (current > target) {
                status = 'warning';
            }
            return {
                name,
                target,
                current,
                status
            };
        });
    }
    /**
   * Record memory usage
   */ recordMemoryUsage() {
        if (!this.isEnabled || "object" === 'undefined') return;
        const memory = performance.memory;
        if (memory) {
            this.recordTiming('memoryUsage', memory.usedJSHeapSize / 1024 / 1024, {
                totalHeapSize: memory.totalJSHeapSize / 1024 / 1024,
                heapSizeLimit: memory.jsHeapSizeLimit / 1024 / 1024
            });
        }
    }
    /**
   * Get current memory usage in MB
   */ getCurrentMemoryUsage() {
        if ("TURBOPACK compile-time falsy", 0) {
            "TURBOPACK unreachable";
        }
        const memory = performance.memory;
        return memory ? memory.usedJSHeapSize / 1024 / 1024 : 0;
    }
    /**
   * Mark performance milestones
   */ mark(name) {
        if (!this.isEnabled) return;
        if (typeof performance !== 'undefined' && performance.mark) {
            performance.mark(name);
        }
    }
    /**
   * Measure between two marks
   */ measure(name, startMark, endMark) {
        if (!this.isEnabled) return 0;
        try {
            if (typeof performance !== 'undefined' && performance.measure) {
                performance.measure(name, startMark, endMark);
                const entries = performance.getEntriesByName(name, 'measure');
                const latestEntry = entries[entries.length - 1];
                if (latestEntry) {
                    this.recordTiming(name, latestEntry.duration);
                    return latestEntry.duration;
                }
            }
        } catch (error) {
            console.warn('Performance measurement failed:', error);
        }
        return 0;
    }
    /**
   * Get performance summary for reporting
   */ getSummary(timeWindow) {
        const cutoff = timeWindow ? Date.now() - timeWindow : 0;
        const relevantEntries = this.entries.filter((entry)=>entry.timestamp > cutoff);
        // Calculate averages by operation
        const operationStats = new Map();
        relevantEntries.forEach((entry)=>{
            const stats = operationStats.get(entry.operation) || {
                total: 0,
                count: 0
            };
            stats.total += entry.duration;
            stats.count += 1;
            operationStats.set(entry.operation, stats);
        });
        // Find worst performers
        const worstPerformers = Array.from(operationStats.entries()).map(([operation, stats])=>({
                operation,
                avgTime: stats.total / stats.count
            })).sort((a, b)=>b.avgTime - a.avgTime).slice(0, 5);
        // Memory trend (last 10 measurements)
        const memoryEntries = relevantEntries.filter((entry)=>entry.operation === 'memoryUsage').slice(-10).map((entry)=>entry.duration);
        return {
            totalOperations: relevantEntries.length,
            averageResponseTime: relevantEntries.reduce((sum, e)=>sum + e.duration, 0) / relevantEntries.length || 0,
            worstPerformers,
            memoryTrend: memoryEntries,
            cacheEfficiency: this.getCacheHitRate()
        };
    }
    /**
   * Clear all performance data
   */ clear() {
        this.entries = [];
        this.operationCounts.clear();
        this.timingStack.clear();
    }
    /**
   * Export performance data for analysis
   */ exportData() {
        return [
            ...this.entries
        ];
    }
    /**
   * Check for performance warnings and log them
   */ checkPerformanceWarnings(operation, duration) {
        const target = this.benchmarks[operation];
        if (target && duration > target * 1.5) {
            console.warn(`🚨 Performance Warning: ${operation} took ${duration.toFixed(2)}ms (target: ${target}ms)`);
        }
    }
    /**
   * Get cache hit rate from cache manager
   */ getCacheHitRate() {
        try {
            // This will be injected by the component using the cache manager
            return globalThis.__CACHE_HIT_RATE__ || 0;
        } catch  {
            return 0;
        }
    }
    /**
   * Setup performance observer for paint timing
   */ setupPerformanceObserver() {
        if (typeof PerformanceObserver === 'undefined') return;
        try {
            const observer = new PerformanceObserver((list)=>{
                for (const entry of list.getEntries()){
                    if (entry.entryType === 'paint') {
                        this.recordTiming(`paint_${entry.name}`, entry.startTime);
                    }
                }
            });
            observer.observe({
                entryTypes: [
                    'paint'
                ]
            });
        } catch (error) {
            console.warn('Performance observer setup failed:', error);
        }
    }
}
const performanceMonitor = new PerformanceMonitor();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/tools/editor/config/performanceConfig.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "PerformanceConfigBuilder": (()=>PerformanceConfigBuilder),
    "RuntimePerformanceAdjuster": (()=>RuntimePerformanceAdjuster),
    "defaultPerformanceConfig": (()=>defaultPerformanceConfig),
    "developmentPerformanceConfig": (()=>developmentPerformanceConfig),
    "getPerformanceConfig": (()=>getPerformanceConfig),
    "productionPerformanceConfig": (()=>productionPerformanceConfig)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const defaultPerformanceConfig = {
    cacheSettings: {
        versionCacheSize: 50,
        diffCacheSize: 30,
        cacheTTL: 600000,
        maxMemoryUsage: 150 * 1024 * 1024 // 150MB total cache limit
    },
    virtualScrolling: {
        enabled: true,
        itemHeight: 60,
        overscan: 5,
        bufferSize: 10 // Buffer size for dynamic height
    },
    debouncing: {
        versionSelectionDelay: 300,
        filterDelay: 150,
        searchDelay: 200,
        scrollDelay: 16 // Throttle scroll events for 60fps
    },
    performance: {
        enableMonitoring: ("TURBOPACK compile-time value", "development") === 'development',
        enablePerfWarnings: true,
        maxPerformanceEntries: 1000,
        memoryCheckInterval: 5000 // Check memory every 5 seconds
    },
    targets: {
        versionLoadTime: 500,
        diffComputeTime: 200,
        renderTime: 300,
        versionSwitching: 200,
        scrollPerformance: 16,
        filterTime: 100,
        memoryUsage: 200 // < 200MB total browser memory usage
    }
};
const productionPerformanceConfig = {
    ...defaultPerformanceConfig,
    cacheSettings: {
        ...defaultPerformanceConfig.cacheSettings,
        versionCacheSize: 30,
        diffCacheSize: 20,
        maxMemoryUsage: 100 * 1024 * 1024 // 100MB limit
    },
    performance: {
        ...defaultPerformanceConfig.performance,
        enableMonitoring: false,
        enablePerfWarnings: false,
        maxPerformanceEntries: 500
    },
    virtualScrolling: {
        ...defaultPerformanceConfig.virtualScrolling,
        overscan: 3,
        bufferSize: 5
    }
};
const developmentPerformanceConfig = {
    ...defaultPerformanceConfig,
    cacheSettings: {
        ...defaultPerformanceConfig.cacheSettings,
        versionCacheSize: 100,
        diffCacheSize: 50
    },
    performance: {
        ...defaultPerformanceConfig.performance,
        enableMonitoring: true,
        enablePerfWarnings: true,
        maxPerformanceEntries: 2000 // More detailed tracking
    },
    targets: {
        ...defaultPerformanceConfig.targets,
        versionLoadTime: 1000,
        diffComputeTime: 500,
        renderTime: 500
    }
};
function getPerformanceConfig() {
    const env = ("TURBOPACK compile-time value", "development");
    switch(env){
        case 'production':
            return productionPerformanceConfig;
        case 'development':
            return developmentPerformanceConfig;
        default:
            return defaultPerformanceConfig;
    }
}
class PerformanceConfigBuilder {
    config;
    constructor(baseConfig = defaultPerformanceConfig){
        this.config = {
            ...baseConfig
        };
    }
    setCacheSize(versionCacheSize, diffCacheSize) {
        this.config.cacheSettings.versionCacheSize = versionCacheSize;
        this.config.cacheSettings.diffCacheSize = diffCacheSize;
        return this;
    }
    setCacheTTL(ttl) {
        this.config.cacheSettings.cacheTTL = ttl;
        return this;
    }
    setVirtualScrolling(enabled, itemHeight, overscan) {
        this.config.virtualScrolling.enabled = enabled;
        if (itemHeight !== undefined) this.config.virtualScrolling.itemHeight = itemHeight;
        if (overscan !== undefined) this.config.virtualScrolling.overscan = overscan;
        return this;
    }
    setDebounceDelays(versionDelay, filterDelay, searchDelay) {
        if (versionDelay !== undefined) this.config.debouncing.versionSelectionDelay = versionDelay;
        if (filterDelay !== undefined) this.config.debouncing.filterDelay = filterDelay;
        if (searchDelay !== undefined) this.config.debouncing.searchDelay = searchDelay;
        return this;
    }
    setPerformanceTargets(targets) {
        this.config.targets = {
            ...this.config.targets,
            ...targets
        };
        return this;
    }
    enableMonitoring(enabled) {
        this.config.performance.enableMonitoring = enabled;
        return this;
    }
    build() {
        return {
            ...this.config
        };
    }
}
class RuntimePerformanceAdjuster {
    config;
    memoryPressureDetected = false;
    constructor(config){
        this.config = {
            ...config
        };
        this.setupMemoryPressureDetection();
    }
    adjustForMemoryPressure() {
        if (!this.memoryPressureDetected) {
            return this.config;
        }
        // Reduce cache sizes under memory pressure
        return {
            ...this.config,
            cacheSettings: {
                ...this.config.cacheSettings,
                versionCacheSize: Math.floor(this.config.cacheSettings.versionCacheSize * 0.7),
                diffCacheSize: Math.floor(this.config.cacheSettings.diffCacheSize * 0.7),
                maxMemoryUsage: Math.floor(this.config.cacheSettings.maxMemoryUsage * 0.8)
            },
            virtualScrolling: {
                ...this.config.virtualScrolling,
                overscan: Math.max(1, this.config.virtualScrolling.overscan - 2)
            }
        };
    }
    adjustForPerformance(averageRenderTime) {
        // If rendering is slow, reduce visual complexity
        if (averageRenderTime > this.config.targets.renderTime * 1.5) {
            return {
                ...this.config,
                virtualScrolling: {
                    ...this.config.virtualScrolling,
                    overscan: Math.max(1, this.config.virtualScrolling.overscan - 1),
                    bufferSize: Math.max(3, this.config.virtualScrolling.bufferSize - 2)
                },
                debouncing: {
                    ...this.config.debouncing,
                    filterDelay: this.config.debouncing.filterDelay + 50,
                    searchDelay: this.config.debouncing.searchDelay + 50
                }
            };
        }
        return this.config;
    }
    setupMemoryPressureDetection() {
        if ("TURBOPACK compile-time falsy", 0) {
            "TURBOPACK unreachable";
        }
        // Monitor memory usage
        setInterval(()=>{
            const memory = performance.memory;
            if (memory) {
                const usedMB = memory.usedJSHeapSize / 1024 / 1024;
                const limitMB = memory.jsHeapSizeLimit / 1024 / 1024;
                // Detect memory pressure at 80% of limit
                this.memoryPressureDetected = usedMB > limitMB * 0.8;
            }
        }, 10000); // Check every 10 seconds
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/tools/editor/hooks/usePerformanceOptimization.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "useOptimizedDiff": (()=>useOptimizedDiff),
    "usePerformanceOptimization": (()=>usePerformanceOptimization),
    "useRenderPerformance": (()=>useRenderPerformance)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$utils$2f$cacheManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tools/editor/utils/cacheManager.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$utils$2f$performanceMonitor$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tools/editor/utils/performanceMonitor.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$config$2f$performanceConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tools/editor/config/performanceConfig.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function usePerformanceOptimization() {
    _s();
    const [cacheStats, setCacheStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "usePerformanceOptimization.useState": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$utils$2f$cacheManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cacheManager"].getStats()
    }["usePerformanceOptimization.useState"]);
    const [performanceMetrics, setPerformanceMetrics] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "usePerformanceOptimization.useState": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$utils$2f$performanceMonitor$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["performanceMonitor"].getCurrentMetrics()
    }["usePerformanceOptimization.useState"]);
    const [recommendations, setRecommendations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$config$2f$performanceConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPerformanceConfig"])());
    const statsUpdateInterval = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])();
    const memoryPressureThreshold = config.current.targets.memoryUsage;
    // Update stats periodically
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePerformanceOptimization.useEffect": ()=>{
            const updateStats = {
                "usePerformanceOptimization.useEffect.updateStats": ()=>{
                    const newCacheStats = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$utils$2f$cacheManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cacheManager"].getStats();
                    const newPerfMetrics = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$utils$2f$performanceMonitor$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["performanceMonitor"].getCurrentMetrics();
                    setCacheStats(newCacheStats);
                    setPerformanceMetrics(newPerfMetrics);
                    // Update global cache hit rate for performance monitor
                    const avgHitRate = (newCacheStats.versionCache.hitRate + newCacheStats.diffCache.hitRate) / 2;
                    globalThis.__CACHE_HIT_RATE__ = avgHitRate;
                    // Generate performance recommendations
                    setRecommendations(generateRecommendations(newCacheStats, newPerfMetrics));
                }
            }["usePerformanceOptimization.useEffect.updateStats"];
            // Initial update
            updateStats();
            // Regular updates - reduced frequency to prevent constant reloading
            statsUpdateInterval.current = setInterval(updateStats, 30000); // Changed from 5s to 30s
            return ({
                "usePerformanceOptimization.useEffect": ()=>{
                    if (statsUpdateInterval.current) {
                        clearInterval(statsUpdateInterval.current);
                    }
                }
            })["usePerformanceOptimization.useEffect"];
        }
    }["usePerformanceOptimization.useEffect"], []);
    // Memory optimization
    const optimizeMemory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePerformanceOptimization.useCallback[optimizeMemory]": ()=>{
            const currentMemory = performanceMetrics.memoryUsage;
            if (currentMemory > memoryPressureThreshold) {
                // Clear oldest cache entries
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$utils$2f$cacheManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cacheManager"].clearAll();
                // Force garbage collection if available
                if (window.gc) {
                    window.gc();
                }
                console.log(`🧹 Memory optimization: Cleared caches (was ${currentMemory.toFixed(1)}MB)`);
            }
        }
    }["usePerformanceOptimization.useCallback[optimizeMemory]"], [
        performanceMetrics.memoryUsage,
        memoryPressureThreshold
    ]);
    // Cache management actions
    const actions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "usePerformanceOptimization.useMemo[actions]": ()=>({
                clearCache: ({
                    "usePerformanceOptimization.useMemo[actions]": ()=>{
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$utils$2f$cacheManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cacheManager"].clearAll();
                        setCacheStats(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$utils$2f$cacheManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cacheManager"].getStats());
                    }
                })["usePerformanceOptimization.useMemo[actions]"],
                invalidateVersion: ({
                    "usePerformanceOptimization.useMemo[actions]": (cellLineId, versionId)=>{
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$utils$2f$cacheManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cacheManager"].invalidateVersion(cellLineId, versionId);
                        setCacheStats(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$utils$2f$cacheManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cacheManager"].getStats());
                    }
                })["usePerformanceOptimization.useMemo[actions]"],
                optimizeMemory,
                getCachedVersion: ({
                    "usePerformanceOptimization.useMemo[actions]": async (cellLineId, versionId)=>{
                        const startTiming = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$utils$2f$performanceMonitor$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["performanceMonitor"].startTiming('versionLoad', {
                            cellLineId,
                            versionId,
                            source: 'cache'
                        });
                        try {
                            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$utils$2f$cacheManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cacheManager"].getVersion(cellLineId, versionId);
                            startTiming();
                            return result;
                        } catch (error) {
                            startTiming();
                            throw error;
                        }
                    }
                })["usePerformanceOptimization.useMemo[actions]"],
                getCachedDiff: ({
                    "usePerformanceOptimization.useMemo[actions]": (leftVersionId, rightVersionId)=>{
                        const startTiming = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$utils$2f$performanceMonitor$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["performanceMonitor"].startTiming('diffLoad', {
                            leftVersionId,
                            rightVersionId,
                            source: 'cache'
                        });
                        const result = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$utils$2f$cacheManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cacheManager"].getDiff(leftVersionId, rightVersionId);
                        startTiming();
                        return result;
                    }
                })["usePerformanceOptimization.useMemo[actions]"],
                setCachedDiff: ({
                    "usePerformanceOptimization.useMemo[actions]": (leftVersionId, rightVersionId, diff)=>{
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$utils$2f$cacheManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cacheManager"].setDiff(leftVersionId, rightVersionId, diff);
                        setCacheStats(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$utils$2f$cacheManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cacheManager"].getStats());
                    }
                })["usePerformanceOptimization.useMemo[actions]"]
            })
    }["usePerformanceOptimization.useMemo[actions]"], [
        optimizeMemory
    ]);
    // Calculate optimization status
    const isOptimized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "usePerformanceOptimization.useMemo[isOptimized]": ()=>{
            const versionHitRate = cacheStats.versionCache.hitRate;
            const diffHitRate = cacheStats.diffCache.hitRate;
            const memoryWithinLimits = performanceMetrics.memoryUsage < memoryPressureThreshold;
            const performanceWithinTargets = performanceMetrics.versionLoadTime < config.current.targets.versionLoadTime && performanceMetrics.diffComputeTime < config.current.targets.diffComputeTime && performanceMetrics.renderTime < config.current.targets.renderTime;
            return versionHitRate > 0.8 && diffHitRate > 0.9 && memoryWithinLimits && performanceWithinTargets;
        }
    }["usePerformanceOptimization.useMemo[isOptimized]"], [
        cacheStats,
        performanceMetrics,
        memoryPressureThreshold
    ]);
    const state = {
        isOptimized,
        cacheStats,
        performanceMetrics,
        memoryUsage: performanceMetrics.memoryUsage,
        recommendations
    };
    return [
        state,
        actions
    ];
}
_s(usePerformanceOptimization, "w3OJAiMiJOcjbQVOjzaHAv2CTqU=");
/**
 * Generate performance recommendations based on current metrics
 */ function generateRecommendations(cacheStats, performanceMetrics) {
    const recommendations = [];
    const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$config$2f$performanceConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPerformanceConfig"])();
    // Cache efficiency recommendations
    if (cacheStats.versionCache.hitRate < 0.8) {
        recommendations.push('Version cache hit rate is low. Consider pre-loading frequently accessed versions.');
    }
    if (cacheStats.diffCache.hitRate < 0.9) {
        recommendations.push('Diff cache hit rate is low. Users may be comparing many unique version pairs.');
    }
    // Performance recommendations
    if (performanceMetrics.versionLoadTime > config.targets.versionLoadTime) {
        recommendations.push('Version loading is slow. Check network conditions or API performance.');
    }
    if (performanceMetrics.diffComputeTime > config.targets.diffComputeTime) {
        recommendations.push('Diff computation is slow. Consider optimizing diff algorithm or reducing field count.');
    }
    if (performanceMetrics.renderTime > config.targets.renderTime) {
        recommendations.push('Rendering is slow. Consider enabling virtualization or reducing DOM complexity.');
    }
    // Memory recommendations
    if (performanceMetrics.memoryUsage > config.targets.memoryUsage) {
        recommendations.push('Memory usage is high. Consider clearing caches or reducing cache sizes.');
    }
    // Cache size recommendations
    if (cacheStats.totalMemoryUsage > 100 * 1024 * 1024) {
        recommendations.push('Cache memory usage is high. Consider reducing cache sizes or TTL.');
    }
    return recommendations;
}
function useOptimizedDiff() {
    _s1();
    const [, { getCachedDiff, setCachedDiff }] = usePerformanceOptimization();
    const computeOptimizedDiff = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useOptimizedDiff.useCallback[computeOptimizedDiff]": async (leftVersion, rightVersion, leftVersionId, rightVersionId, diffFunction)=>{
            // Try cache first
            const cached = getCachedDiff(leftVersionId, rightVersionId);
            if (cached) {
                return cached;
            }
            // Compute diff with performance monitoring
            const startTiming = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$utils$2f$performanceMonitor$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["performanceMonitor"].startTiming('diffCompute', {
                leftVersionId,
                rightVersionId,
                fieldCount: Object.keys(leftVersion).length
            });
            try {
                const diff = diffFunction(leftVersion, rightVersion);
                // Cache the result
                setCachedDiff(leftVersionId, rightVersionId, diff);
                const duration = startTiming();
                console.log(`📊 Diff computed in ${duration.toFixed(2)}ms for ${Object.keys(leftVersion).length} fields`);
                return diff;
            } catch (error) {
                startTiming();
                throw error;
            }
        }
    }["useOptimizedDiff.useCallback[computeOptimizedDiff]"], [
        getCachedDiff,
        setCachedDiff
    ]);
    return {
        computeOptimizedDiff
    };
}
_s1(useOptimizedDiff, "wbDJ6va1ZqwGie2FdqzNp2umPe4=", false, function() {
    return [
        usePerformanceOptimization
    ];
});
function useRenderPerformance(componentName) {
    _s2();
    const renderCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const lastRenderTime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useRenderPerformance.useEffect": ()=>{
            const startTime = performance.now();
            return ({
                "useRenderPerformance.useEffect": ()=>{
                    const endTime = performance.now();
                    const renderTime = endTime - startTime;
                    renderCount.current++;
                    lastRenderTime.current = renderTime;
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$utils$2f$performanceMonitor$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["performanceMonitor"].recordTiming(`render_${componentName}`, renderTime, {
                        renderCount: renderCount.current
                    });
                }
            })["useRenderPerformance.useEffect"];
        }
    }["useRenderPerformance.useEffect"], [
        componentName
    ]);
    return {
        renderCount: renderCount.current,
        lastRenderTime: lastRenderTime.current
    };
}
_s2(useRenderPerformance, "/ap1igPmB/tBOJYpn2fcMRax4jQ=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/tools/editor/components/VirtualizedDiffViewer.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "VirtualizedDiffViewer": (()=>VirtualizedDiffViewer)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
// @ts-expect-error - react-window types may not be fully compatible
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$window$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-window/dist/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$components$2f$DiffField$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tools/editor/components/DiffField.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$hooks$2f$useNestedObjectState$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tools/editor/hooks/useNestedObjectState.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$hooks$2f$usePerformanceOptimization$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tools/editor/hooks/usePerformanceOptimization.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$utils$2f$performanceMonitor$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tools/editor/utils/performanceMonitor.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$config$2f$performanceConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tools/editor/config/performanceConfig.ts [app-client] (ecmascript)");
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
function VirtualizedDiffViewer({ diffResults, showDifferencesOnly, itemHeight = 64, onFieldExpand, onFieldCollapse, isScrollLocked = false, onScroll, scrollTop = 0, leftCellLine, leftVersion, rightCellLine, rightVersion }) {
    _s();
    const { toggleExpansion, isExpanded } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$hooks$2f$useNestedObjectState$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNestedObjectState"])();
    const { renderCount } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$hooks$2f$usePerformanceOptimization$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRenderPerformance"])('VirtualizedDiffViewer');
    const listRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$config$2f$performanceConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPerformanceConfig"])();
    // Filter diff results with memoization and performance tracking
    const filteredResults = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "VirtualizedDiffViewer.useMemo[filteredResults]": ()=>{
            const startTiming = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$utils$2f$performanceMonitor$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["performanceMonitor"].startTiming('filter', {
                totalResults: diffResults.length,
                showDifferencesOnly
            });
            try {
                const filtered = filterDiffResults(diffResults, showDifferencesOnly);
                const duration = startTiming();
                if (duration > config.targets.filterTime) {
                    console.warn(`🐌 Slow filter: ${duration.toFixed(2)}ms for ${diffResults.length} items`);
                }
                return filtered;
            } catch (error) {
                startTiming();
                throw error;
            }
        }
    }["VirtualizedDiffViewer.useMemo[filteredResults]"], [
        diffResults,
        showDifferencesOnly,
        config.targets.filterTime
    ]);
    // Maintain scroll position during updates and state changes
    const scrollTopRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(scrollTop);
    const lastScrollTop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VirtualizedDiffViewer.useEffect": ()=>{
            scrollTopRef.current = scrollTop;
        }
    }["VirtualizedDiffViewer.useEffect"], [
        scrollTop
    ]);
    // Handle field expansion with performance tracking
    const handleFieldToggle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "VirtualizedDiffViewer.useCallback[handleFieldToggle]": (fieldPath)=>{
            const startTiming = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$utils$2f$performanceMonitor$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["performanceMonitor"].startTiming('fieldToggle', {
                fieldPath
            });
            try {
                const wasExpanded = isExpanded(fieldPath);
                toggleExpansion(fieldPath);
                if (wasExpanded && onFieldCollapse) {
                    onFieldCollapse(fieldPath);
                } else if (!wasExpanded && onFieldExpand) {
                    onFieldExpand(fieldPath);
                }
                startTiming();
            } catch (error) {
                startTiming();
                throw error;
            }
        }
    }["VirtualizedDiffViewer.useCallback[handleFieldToggle]"], [
        isExpanded,
        toggleExpansion,
        onFieldCollapse,
        onFieldExpand
    ]);
    // Optimized scroll handler with scroll position preservation
    const handleScroll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "VirtualizedDiffViewer.useCallback[handleScroll]": ({ scrollTop: newScrollTop })=>{
            // Save current scroll position for restoration
            lastScrollTop.current = newScrollTop;
            // Only call scroll handler, avoid performance monitoring during scroll for stability
            if (onScroll && !isScrollLocked) {
                onScroll(newScrollTop);
            }
        }
    }["VirtualizedDiffViewer.useCallback[handleScroll]"], [
        onScroll,
        isScrollLocked
    ]);
    // Simplified Row renderer - no array expansion complexity
    const Row = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "VirtualizedDiffViewer.useCallback[Row]": ({ index, style })=>{
            const diffResult = filteredResults[index];
            if (!diffResult) return null;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: style,
                className: "virtual-row-container",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MemoizedDiffField, {
                    diffResult: diffResult,
                    isExpanded: isExpanded(diffResult.fieldPath),
                    onToggleExpansion: {
                        "VirtualizedDiffViewer.useCallback[Row]": ()=>handleFieldToggle(diffResult.fieldPath)
                    }["VirtualizedDiffViewer.useCallback[Row]"],
                    showDifferencesOnly: showDifferencesOnly,
                    indentLevel: 0,
                    isVirtualized: true,
                    leftCellLine: leftCellLine,
                    leftVersion: leftVersion,
                    rightCellLine: rightCellLine,
                    rightVersion: rightVersion
                }, void 0, false, {
                    fileName: "[project]/src/app/tools/editor/components/VirtualizedDiffViewer.tsx",
                    lineNumber: 122,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/tools/editor/components/VirtualizedDiffViewer.tsx",
                lineNumber: 121,
                columnNumber: 7
            }, this);
        }
    }["VirtualizedDiffViewer.useCallback[Row]"], [
        filteredResults,
        isExpanded,
        handleFieldToggle,
        showDifferencesOnly,
        leftCellLine,
        leftVersion,
        rightCellLine,
        rightVersion
    ]);
    // Helper function to check if field has significant text content
    const hasSignificantTextContent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "VirtualizedDiffViewer.useCallback[hasSignificantTextContent]": (diffResult)=>{
            const leftText = String(diffResult.leftValue || '');
            const rightText = String(diffResult.rightValue || '');
            const maxLength = Math.max(leftText.length, rightText.length);
            // Consider text significant if it's longer than 50 characters
            return maxLength > 50;
        }
    }["VirtualizedDiffViewer.useCallback[hasSignificantTextContent]"], []);
    // Simplified content-aware height calculation - no array expansion complexity
    const getItemSize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "VirtualizedDiffViewer.useCallback[getItemSize]": (index)=>{
            const diffResult = filteredResults[index];
            if (!diffResult) return 48; // Reduced default height for simple fields
            const isFieldExpanded = isExpanded(diffResult.fieldPath);
            // Start with base height - reduced for more compact layout
            let calculatedHeight = 48;
            // Check if this field contains arrays - now use fixed height since arrays use modal
            const hasArrays = Array.isArray(diffResult.leftValue) || Array.isArray(diffResult.rightValue);
            if (hasArrays) {
                // Fixed height for all array summaries - reduced for compact layout
                return 60; // Consistent height for array summary components
            }
            // Enhanced text content height calculation (for non-array fields)
            const leftText = String(diffResult.leftValue || '');
            const rightText = String(diffResult.rightValue || '');
            // Only calculate text height for significant text content
            if (hasSignificantTextContent(diffResult)) {
                const textHeight = calculateTextHeight(leftText, rightText);
                calculatedHeight = Math.max(calculatedHeight, textHeight);
            }
            // Check if this field contains complex object content (non-array)
            const hasComplexContent = {
                "VirtualizedDiffViewer.useCallback[getItemSize].hasComplexContent": (value)=>{
                    return value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length > 0;
                }
            }["VirtualizedDiffViewer.useCallback[getItemSize].hasComplexContent"];
            const leftIsComplex = hasComplexContent(diffResult.leftValue);
            const rightIsComplex = hasComplexContent(diffResult.rightValue);
            // If field has complex object content that's not an array
            if (leftIsComplex || rightIsComplex) {
                // Base height for object content - reduced
                let objectHeight = 60;
                // Add height for expanded state
                if (isFieldExpanded) {
                    const childrenCount = diffResult.children?.length || 0;
                    const extraHeight = Math.min(childrenCount * 30, 160); // Reduced spacing
                    objectHeight += extraHeight;
                }
                calculatedHeight = Math.max(calculatedHeight, objectHeight);
            }
            // Reduced professional padding
            return calculatedHeight + 8; // 4px top + 4px bottom padding
        }
    }["VirtualizedDiffViewer.useCallback[getItemSize]"], [
        filteredResults,
        isExpanded,
        hasSignificantTextContent
    ]);
    // Helper function for text height calculation
    const calculateTextHeight = (leftText, rightText)=>{
        // Estimate wrapped lines (assuming 60 chars per line in diff view)
        const leftLines = Math.ceil(leftText.length / 60);
        const rightLines = Math.ceil(rightText.length / 60);
        const maxLines = Math.max(leftLines, rightLines);
        // 24px per line + 8px line spacing, minimum 64px
        return Math.max(64, maxLines * 32);
    };
    // Very stable key for virtual list to preserve scroll position
    const listKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "VirtualizedDiffViewer.useMemo[listKey]": ()=>{
            // Use a consistent key since we always use VariableSizeList
            return 'diff-list-variable';
        }
    }["VirtualizedDiffViewer.useMemo[listKey]"], []);
    // Empty state with performance info
    if (filteredResults.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center h-full bg-gray-50 rounded-lg border border-gray-200",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center text-gray-500",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        className: "mx-auto h-12 w-12 text-gray-400 mb-4",
                        fill: "none",
                        viewBox: "0 0 24 24",
                        stroke: "currentColor",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 2,
                            d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        }, void 0, false, {
                            fileName: "[project]/src/app/tools/editor/components/VirtualizedDiffViewer.tsx",
                            lineNumber: 226,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/tools/editor/components/VirtualizedDiffViewer.tsx",
                        lineNumber: 225,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm font-medium",
                        children: showDifferencesOnly ? 'No differences found' : 'No data to display'
                    }, void 0, false, {
                        fileName: "[project]/src/app/tools/editor/components/VirtualizedDiffViewer.tsx",
                        lineNumber: 228,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-gray-400 mt-1",
                        children: showDifferencesOnly ? 'All fields are identical' : 'Select versions to compare'
                    }, void 0, false, {
                        fileName: "[project]/src/app/tools/editor/components/VirtualizedDiffViewer.tsx",
                        lineNumber: 231,
                        columnNumber: 11
                    }, this),
                    ("TURBOPACK compile-time value", "development") === 'development' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-blue-400 mt-2",
                        children: [
                            "Renders: ",
                            renderCount,
                            " | Items processed: ",
                            diffResults.length,
                            " | Filtered: ",
                            filteredResults.length
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/tools/editor/components/VirtualizedDiffViewer.tsx",
                        lineNumber: 235,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/tools/editor/components/VirtualizedDiffViewer.tsx",
                lineNumber: 224,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/tools/editor/components/VirtualizedDiffViewer.tsx",
            lineNumber: 223,
            columnNumber: 7
        }, this);
    }
    // Simplified virtualized list - no global expansion controls needed
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "virtualized-diff-viewer bg-white relative pr-6",
        style: {
            width: '100%',
            height: '700px'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                height: '100%'
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$window$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VariableSizeList"], {
                ref: listRef,
                height: 700,
                width: "100%",
                itemCount: filteredResults.length,
                itemSize: getItemSize,
                onScroll: handleScroll,
                className: "diff-virtual-list",
                overscanCount: config.virtualScrolling.overscan,
                children: Row
            }, listKey, false, {
                fileName: "[project]/src/app/tools/editor/components/VirtualizedDiffViewer.tsx",
                lineNumber: 249,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/tools/editor/components/VirtualizedDiffViewer.tsx",
            lineNumber: 248,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/tools/editor/components/VirtualizedDiffViewer.tsx",
        lineNumber: 246,
        columnNumber: 5
    }, this);
}
_s(VirtualizedDiffViewer, "gStudD8A73qXkWqp4FT3PCAf+IE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$hooks$2f$useNestedObjectState$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNestedObjectState"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$hooks$2f$usePerformanceOptimization$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRenderPerformance"]
    ];
});
_c = VirtualizedDiffViewer;
// Memoized DiffField component for better performance
const MemoizedDiffField = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].memo(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$components$2f$DiffField$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DiffField"], (prevProps, nextProps)=>{
    // Quick shallow checks first
    if (prevProps.diffResult.fieldPath !== nextProps.diffResult.fieldPath || prevProps.diffResult.changeType !== nextProps.diffResult.changeType || prevProps.isExpanded !== nextProps.isExpanded || prevProps.showDifferencesOnly !== nextProps.showDifferencesOnly) {
        return false;
    }
    // More efficient value comparison - avoid JSON.stringify
    const prevLeft = prevProps.diffResult.leftValue;
    const nextLeft = nextProps.diffResult.leftValue;
    const prevRight = prevProps.diffResult.rightValue;
    const nextRight = nextProps.diffResult.rightValue;
    // Simple equality check for primitives, shallow check for objects
    if (prevLeft !== nextLeft || prevRight !== nextRight) {
        // For arrays and objects, do a shallow comparison
        if (Array.isArray(prevLeft) && Array.isArray(nextLeft)) {
            if (prevLeft.length !== nextLeft.length) return false;
        }
        if (Array.isArray(prevRight) && Array.isArray(nextRight)) {
            if (prevRight.length !== nextRight.length) return false;
        }
        // If values changed, let it re-render (better than expensive deep comparison)
        return false;
    }
    return true;
});
_c1 = MemoizedDiffField;
/**
 * Filter diff results based on showDifferencesOnly toggle
 */ function filterDiffResults(diffResults, showDifferencesOnly) {
    if (!showDifferencesOnly) return diffResults;
    return diffResults.filter((result)=>{
        if (result.changeType === 'UNCHANGED' || result.changeType === 'NOT_SET') {
            return false;
        }
        // For nested objects, check if any children have changes
        if (result.children) {
            const hasChangedChildren = hasNestedChanges(result);
            return hasChangedChildren;
        }
        return true;
    });
}
/**
 * Recursively check if a diff result has any changed children
 */ function hasNestedChanges(diffResult) {
    if (diffResult.changeType !== 'UNCHANGED' && diffResult.changeType !== 'NOT_SET') {
        return true;
    }
    if (diffResult.children) {
        return diffResult.children.some((child)=>hasNestedChanges(child));
    }
    return false;
}
var _c, _c1;
__turbopack_context__.k.register(_c, "VirtualizedDiffViewer");
__turbopack_context__.k.register(_c1, "MemoizedDiffField");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/tools/editor/hooks/useDebouncedOperations.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "useBatchedOperations": (()=>useBatchedOperations),
    "useDebouncedInput": (()=>useDebouncedInput),
    "useDebouncedOperations": (()=>useDebouncedOperations)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
// @ts-ignore - lodash types may not be fully compatible
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lodash$2f$debounce$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lodash/debounce.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lodash$2f$throttle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lodash/throttle.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$config$2f$performanceConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tools/editor/config/performanceConfig.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$utils$2f$performanceMonitor$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tools/editor/utils/performanceMonitor.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
function useDebouncedOperations(onVersionSelect, onFilter, onSearch) {
    _s();
    const [isVersionSelectionPending, setIsVersionSelectionPending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isFilterPending, setIsFilterPending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isSearchPending, setIsSearchPending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$config$2f$performanceConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPerformanceConfig"])();
    const abortControllers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Map());
    // Cleanup abort controllers on unmount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useDebouncedOperations.useEffect": ()=>{
            return ({
                "useDebouncedOperations.useEffect": ()=>{
                    abortControllers.current.forEach({
                        "useDebouncedOperations.useEffect": (controller)=>controller.abort()
                    }["useDebouncedOperations.useEffect"]);
                    abortControllers.current.clear();
                }
            })["useDebouncedOperations.useEffect"];
        }
    }["useDebouncedOperations.useEffect"], []);
    // Version selection with deduplication and performance tracking
    const debouncedVersionSelect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useDebouncedOperations.useMemo[debouncedVersionSelect]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lodash$2f$debounce$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
                "useDebouncedOperations.useMemo[debouncedVersionSelect]": (cellLineId, versionId, panel)=>{
                    if (!onVersionSelect) return;
                    const startTiming = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$utils$2f$performanceMonitor$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["performanceMonitor"].startTiming('versionSwitching', {
                        cellLineId,
                        versionId,
                        panel
                    });
                    // Cancel any existing request for this panel
                    const requestKey = `version_${panel}`;
                    const existingController = abortControllers.current.get(requestKey);
                    if (existingController) {
                        existingController.abort();
                    }
                    // Create new abort controller
                    const controller = new AbortController();
                    abortControllers.current.set(requestKey, controller);
                    try {
                        setIsVersionSelectionPending(false);
                        onVersionSelect(cellLineId, versionId, panel);
                        const duration = startTiming();
                        console.log(`⚡ Version switch completed in ${duration.toFixed(2)}ms`);
                        // Clean up controller
                        abortControllers.current.delete(requestKey);
                    } catch (error) {
                        startTiming();
                        console.error('Version selection failed:', error);
                        abortControllers.current.delete(requestKey);
                    }
                }
            }["useDebouncedOperations.useMemo[debouncedVersionSelect]"], config.debouncing.versionSelectionDelay)
    }["useDebouncedOperations.useMemo[debouncedVersionSelect]"], [
        onVersionSelect,
        config.debouncing.versionSelectionDelay
    ]);
    // Filter operations with performance tracking
    const debouncedFilter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useDebouncedOperations.useMemo[debouncedFilter]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lodash$2f$debounce$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
                "useDebouncedOperations.useMemo[debouncedFilter]": (showDifferencesOnly)=>{
                    if (!onFilter) return;
                    const startTiming = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$utils$2f$performanceMonitor$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["performanceMonitor"].startTiming('filter', {
                        showDifferencesOnly
                    });
                    try {
                        setIsFilterPending(false);
                        onFilter(showDifferencesOnly);
                        const duration = startTiming();
                        console.log(`🔍 Filter applied in ${duration.toFixed(2)}ms`);
                    } catch (error) {
                        startTiming();
                        console.error('Filter operation failed:', error);
                    }
                }
            }["useDebouncedOperations.useMemo[debouncedFilter]"], config.debouncing.filterDelay)
    }["useDebouncedOperations.useMemo[debouncedFilter]"], [
        onFilter,
        config.debouncing.filterDelay
    ]);
    // Search operations with abort capability
    const debouncedSearch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useDebouncedOperations.useMemo[debouncedSearch]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lodash$2f$debounce$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
                "useDebouncedOperations.useMemo[debouncedSearch]": (searchTerm)=>{
                    if (!onSearch) return;
                    const startTiming = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$utils$2f$performanceMonitor$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["performanceMonitor"].startTiming('search', {
                        searchLength: searchTerm.length,
                        hasQuery: searchTerm.length > 0
                    });
                    // Cancel previous search
                    const existingController = abortControllers.current.get('search');
                    if (existingController) {
                        existingController.abort();
                    }
                    if (searchTerm.length === 0) {
                        setIsSearchPending(false);
                        onSearch(searchTerm);
                        startTiming();
                        return;
                    }
                    // Create new search controller
                    const controller = new AbortController();
                    abortControllers.current.set('search', controller);
                    try {
                        setIsSearchPending(false);
                        onSearch(searchTerm);
                        const duration = startTiming();
                        console.log(`🔎 Search completed in ${duration.toFixed(2)}ms`);
                        abortControllers.current.delete('search');
                    } catch (error) {
                        startTiming();
                        console.error('Search operation failed:', error);
                        abortControllers.current.delete('search');
                    }
                }
            }["useDebouncedOperations.useMemo[debouncedSearch]"], config.debouncing.searchDelay)
    }["useDebouncedOperations.useMemo[debouncedSearch]"], [
        onSearch,
        config.debouncing.searchDelay
    ]);
    // Throttled scroll handler for 60fps performance
    const throttledScroll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useDebouncedOperations.useCallback[throttledScroll]": (scrollHandler)=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lodash$2f$throttle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
                "useDebouncedOperations.useCallback[throttledScroll]": ()=>{
                    const startTiming = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$utils$2f$performanceMonitor$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["performanceMonitor"].startTiming('scroll');
                    try {
                        scrollHandler();
                        const duration = startTiming();
                        // Only log if scroll performance is poor
                        if (duration > config.targets.scrollPerformance) {
                            console.warn(`📜 Slow scroll: ${duration.toFixed(2)}ms (target: ${config.targets.scrollPerformance}ms)`);
                        }
                    } catch (error) {
                        startTiming();
                        console.error('Scroll handler failed:', error);
                    }
                }
            }["useDebouncedOperations.useCallback[throttledScroll]"], config.debouncing.scrollDelay);
        }
    }["useDebouncedOperations.useCallback[throttledScroll]"], [
        config.debouncing.scrollDelay,
        config.targets.scrollPerformance
    ]);
    // Wrapper functions that set pending state
    const wrappedVersionSelect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useDebouncedOperations.useCallback[wrappedVersionSelect]": (cellLineId, versionId, panel)=>{
            setIsVersionSelectionPending(true);
            debouncedVersionSelect(cellLineId, versionId, panel);
        }
    }["useDebouncedOperations.useCallback[wrappedVersionSelect]"], [
        debouncedVersionSelect
    ]);
    const wrappedFilter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useDebouncedOperations.useCallback[wrappedFilter]": (showDifferencesOnly)=>{
            setIsFilterPending(true);
            debouncedFilter(showDifferencesOnly);
        }
    }["useDebouncedOperations.useCallback[wrappedFilter]"], [
        debouncedFilter
    ]);
    const wrappedSearch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useDebouncedOperations.useCallback[wrappedSearch]": (searchTerm)=>{
            setIsSearchPending(true);
            debouncedSearch(searchTerm);
        }
    }["useDebouncedOperations.useCallback[wrappedSearch]"], [
        debouncedSearch
    ]);
    // Cancel all pending operations
    const cancelPendingOperations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useDebouncedOperations.useCallback[cancelPendingOperations]": ()=>{
            // Cancel debounced functions
            debouncedVersionSelect.cancel();
            debouncedFilter.cancel();
            debouncedSearch.cancel();
            // Abort any in-flight requests
            abortControllers.current.forEach({
                "useDebouncedOperations.useCallback[cancelPendingOperations]": (controller)=>controller.abort()
            }["useDebouncedOperations.useCallback[cancelPendingOperations]"]);
            abortControllers.current.clear();
            // Reset pending states
            setIsVersionSelectionPending(false);
            setIsFilterPending(false);
            setIsSearchPending(false);
        }
    }["useDebouncedOperations.useCallback[cancelPendingOperations]"], [
        debouncedVersionSelect,
        debouncedFilter,
        debouncedSearch
    ]);
    // Calculate total pending operations
    const pendingOperations = [
        isVersionSelectionPending,
        isFilterPending,
        isSearchPending
    ].filter(Boolean).length;
    const state = {
        isVersionSelectionPending,
        isFilterPending,
        isSearchPending,
        pendingOperations
    };
    const actions = {
        debouncedVersionSelect: wrappedVersionSelect,
        debouncedFilter: wrappedFilter,
        debouncedSearch: wrappedSearch,
        throttledScroll,
        cancelPendingOperations
    };
    return [
        state,
        actions
    ];
}
_s(useDebouncedOperations, "iUApzyFg08vuNRI+1CMpE7T586k=");
function useDebouncedInput(initialValue, onDebouncedChange, delay = 300) {
    _s1();
    const [displayValue, setDisplayValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialValue);
    const [isPending, setIsPending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const debouncedCallback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useDebouncedInput.useMemo[debouncedCallback]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lodash$2f$debounce$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
                "useDebouncedInput.useMemo[debouncedCallback]": (value)=>{
                    onDebouncedChange(value);
                    setIsPending(false);
                }
            }["useDebouncedInput.useMemo[debouncedCallback]"], delay)
    }["useDebouncedInput.useMemo[debouncedCallback]"], [
        onDebouncedChange,
        delay
    ]);
    const setValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useDebouncedInput.useCallback[setValue]": (value)=>{
            setDisplayValue(value);
            setIsPending(true);
            debouncedCallback(value);
        }
    }["useDebouncedInput.useCallback[setValue]"], [
        debouncedCallback
    ]);
    // Cleanup on unmount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useDebouncedInput.useEffect": ()=>{
            return ({
                "useDebouncedInput.useEffect": ()=>{
                    debouncedCallback.cancel();
                }
            })["useDebouncedInput.useEffect"];
        }
    }["useDebouncedInput.useEffect"], [
        debouncedCallback
    ]);
    return {
        value: displayValue,
        setValue,
        isPending
    };
}
_s1(useDebouncedInput, "ZrLdbXtCn2fsEbjXNtfZ9wIDmXA=");
function useBatchedOperations(onBatchProcess, batchSize = 10, delay = 100) {
    _s2();
    const batch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const [pendingCount, setPendingCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const processBatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useBatchedOperations.useMemo[processBatch]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lodash$2f$debounce$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
                "useBatchedOperations.useMemo[processBatch]": ()=>{
                    if (batch.current.length === 0) return;
                    const startTiming = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$utils$2f$performanceMonitor$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["performanceMonitor"].startTiming('batchOperation', {
                        batchSize: batch.current.length
                    });
                    try {
                        onBatchProcess([
                            ...batch.current
                        ]);
                        batch.current = [];
                        setPendingCount(0);
                        const duration = startTiming();
                        console.log(`📦 Batch processed in ${duration.toFixed(2)}ms`);
                    } catch (error) {
                        startTiming();
                        console.error('Batch processing failed:', error);
                    }
                }
            }["useBatchedOperations.useMemo[processBatch]"], delay)
    }["useBatchedOperations.useMemo[processBatch]"], [
        onBatchProcess,
        delay
    ]);
    const addToBatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useBatchedOperations.useCallback[addToBatch]": (item)=>{
            batch.current.push(item);
            setPendingCount(batch.current.length);
            // Process immediately if batch is full
            if (batch.current.length >= batchSize) {
                processBatch.flush();
            } else {
                processBatch();
            }
        }
    }["useBatchedOperations.useCallback[addToBatch]"], [
        batchSize,
        processBatch
    ]);
    const flushBatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useBatchedOperations.useCallback[flushBatch]": ()=>{
            processBatch.flush();
        }
    }["useBatchedOperations.useCallback[flushBatch]"], [
        processBatch
    ]);
    // Cleanup on unmount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useBatchedOperations.useEffect": ()=>{
            return ({
                "useBatchedOperations.useEffect": ()=>{
                    processBatch.cancel();
                }
            })["useBatchedOperations.useEffect"];
        }
    }["useBatchedOperations.useEffect"], [
        processBatch
    ]);
    return {
        addToBatch,
        flushBatch,
        pendingCount
    };
}
_s2(useBatchedOperations, "FA3Z2Lng5dlI3sPg7kULwRSdcRY=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/tools/editor/components/PerformanceDashboard.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "PerformanceDashboard": (()=>PerformanceDashboard)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$hooks$2f$usePerformanceOptimization$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tools/editor/hooks/usePerformanceOptimization.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$utils$2f$performanceMonitor$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tools/editor/utils/performanceMonitor.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function PerformanceDashboard({ isVisible = false, onToggleVisibility }) {
    _s();
    const [perfState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$hooks$2f$usePerformanceOptimization$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePerformanceOptimization"])();
    const [benchmarks, setBenchmarks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$utils$2f$performanceMonitor$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["performanceMonitor"].getBenchmarks());
    const [summary, setSummary] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$utils$2f$performanceMonitor$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["performanceMonitor"].getSummary(60000)); // Last minute
    // Update performance data every 2 seconds
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PerformanceDashboard.useEffect": ()=>{
            if (!isVisible) return;
            const interval = setInterval({
                "PerformanceDashboard.useEffect.interval": ()=>{
                    setBenchmarks(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$utils$2f$performanceMonitor$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["performanceMonitor"].getBenchmarks());
                    setSummary(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$utils$2f$performanceMonitor$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["performanceMonitor"].getSummary(60000));
                }
            }["PerformanceDashboard.useEffect.interval"], 2000);
            return ({
                "PerformanceDashboard.useEffect": ()=>clearInterval(interval)
            })["PerformanceDashboard.useEffect"];
        }
    }["PerformanceDashboard.useEffect"], [
        isVisible
    ]);
    // Only render in development
    if ("TURBOPACK compile-time falsy", 0) {
        "TURBOPACK unreachable";
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onToggleVisibility,
                className: `fixed bottom-4 right-4 z-50 p-3 rounded-full shadow-lg transition-all duration-200 ${isVisible ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`,
                title: isVisible ? 'Hide Performance Dashboard' : 'Show Performance Dashboard',
                children: isVisible ? '📊❌' : '📊'
            }, void 0, false, {
                fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, this),
            isVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed bottom-20 right-4 z-40 w-80 bg-white border border-gray-200 rounded-lg shadow-xl max-h-96 overflow-y-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 border-b border-gray-200",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-lg font-semibold text-gray-800 flex items-center gap-2",
                            children: [
                                "⚡ Performance Monitor",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: `w-2 h-2 rounded-full ${perfState.isOptimized ? 'bg-green-500' : 'bg-yellow-500'}`
                                }, void 0, false, {
                                    fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                    lineNumber: 58,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                            lineNumber: 56,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                        lineNumber: 55,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "font-medium text-gray-700 mb-2",
                                        children: "Cache Performance"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                        lineNumber: 67,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2 text-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Version Cache:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                                        lineNumber: 70,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: `font-mono ${perfState.cacheStats.versionCache.hitRate > 0.8 ? 'text-green-600' : 'text-yellow-600'}`,
                                                        children: [
                                                            (perfState.cacheStats.versionCache.hitRate * 100).toFixed(1),
                                                            "%"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                                        lineNumber: 71,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                                lineNumber: 69,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Diff Cache:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                                        lineNumber: 78,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: `font-mono ${perfState.cacheStats.diffCache.hitRate > 0.9 ? 'text-green-600' : 'text-yellow-600'}`,
                                                        children: [
                                                            (perfState.cacheStats.diffCache.hitRate * 100).toFixed(1),
                                                            "%"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                                        lineNumber: 79,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                                lineNumber: 77,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Memory Usage:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                                        lineNumber: 86,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-mono text-blue-600",
                                                        children: [
                                                            (perfState.cacheStats.totalMemoryUsage / 1024 / 1024).toFixed(1),
                                                            "MB"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                                        lineNumber: 87,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                                lineNumber: 85,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                        lineNumber: 68,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                lineNumber: 66,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "font-medium text-gray-700 mb-2",
                                        children: "Response Times"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                        lineNumber: 96,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-1 text-sm",
                                        children: benchmarks.map((benchmark)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between items-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "capitalize",
                                                        children: [
                                                            benchmark.name.replace(/([A-Z])/g, ' $1').toLowerCase(),
                                                            ":"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                                        lineNumber: 100,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-mono text-xs",
                                                                children: [
                                                                    benchmark.current.toFixed(0),
                                                                    "ms"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                                                lineNumber: 104,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: `w-2 h-2 rounded-full ${benchmark.status === 'pass' ? 'bg-green-500' : benchmark.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                                                lineNumber: 107,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                                        lineNumber: 103,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, benchmark.name, true, {
                                                fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                                lineNumber: 99,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                        lineNumber: 97,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                lineNumber: 95,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "font-medium text-gray-700 mb-2",
                                        children: "Memory Trend"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                        lineNumber: 119,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-16 bg-gray-50 rounded p-2 relative",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MemoryTrendChart, {
                                            data: summary.memoryTrend
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                            lineNumber: 121,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                        lineNumber: 120,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                lineNumber: 118,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "font-medium text-gray-700 mb-2",
                                        children: "Activity Summary"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                        lineNumber: 127,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-1 text-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Operations:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                                        lineNumber: 130,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-mono",
                                                        children: summary.totalOperations
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                                        lineNumber: 131,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                                lineNumber: 129,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Avg Response:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                                        lineNumber: 134,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-mono",
                                                        children: [
                                                            summary.averageResponseTime.toFixed(1),
                                                            "ms"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                                        lineNumber: 135,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                                lineNumber: 133,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Cache Efficiency:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                                        lineNumber: 138,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-mono",
                                                        children: [
                                                            (summary.cacheEfficiency * 100).toFixed(1),
                                                            "%"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                                        lineNumber: 139,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                                lineNumber: 137,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                        lineNumber: 128,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                lineNumber: 126,
                                columnNumber: 13
                            }, this),
                            summary.worstPerformers.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "font-medium text-gray-700 mb-2",
                                        children: "Slow Operations"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                        lineNumber: 147,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-1 text-xs",
                                        children: summary.worstPerformers.slice(0, 3).map((perf, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between text-red-600",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: [
                                                            perf.operation,
                                                            ":"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                                        lineNumber: 151,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-mono",
                                                        children: [
                                                            perf.avgTime.toFixed(1),
                                                            "ms"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                                        lineNumber: 152,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, index, true, {
                                                fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                                lineNumber: 150,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                        lineNumber: 148,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                lineNumber: 146,
                                columnNumber: 15
                            }, this),
                            perfState.recommendations.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "font-medium text-gray-700 mb-2",
                                        children: "Recommendations"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                        lineNumber: 162,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-1 text-xs text-yellow-700",
                                        children: perfState.recommendations.slice(0, 2).map((rec, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "p-2 bg-yellow-50 rounded",
                                                children: [
                                                    "💡 ",
                                                    rec
                                                ]
                                            }, index, true, {
                                                fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                                lineNumber: 165,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                        lineNumber: 163,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                lineNumber: 161,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                        lineNumber: 64,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-3 border-t border-gray-200 flex gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$utils$2f$performanceMonitor$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["performanceMonitor"].clear();
                                    setBenchmarks(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$utils$2f$performanceMonitor$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["performanceMonitor"].getBenchmarks());
                                    setSummary(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$utils$2f$performanceMonitor$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["performanceMonitor"].getSummary());
                                },
                                className: "flex-1 px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors",
                                children: "Clear Data"
                            }, void 0, false, {
                                fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                lineNumber: 176,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    const data = {
                                        timestamp: new Date().toISOString(),
                                        perfState,
                                        benchmarks,
                                        summary
                                    };
                                    const blob = new Blob([
                                        JSON.stringify(data, null, 2)
                                    ], {
                                        type: 'application/json'
                                    });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = `performance-report-${Date.now()}.json`;
                                    document.body.appendChild(a);
                                    a.click();
                                    document.body.removeChild(a);
                                    URL.revokeObjectURL(url);
                                },
                                className: "flex-1 px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors",
                                children: "Export Report"
                            }, void 0, false, {
                                fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                                lineNumber: 186,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                        lineNumber: 175,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                lineNumber: 54,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true);
}
_s(PerformanceDashboard, "d4bST9S/QDwHOUPk9XDc6cBmvX4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$hooks$2f$usePerformanceOptimization$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePerformanceOptimization"]
    ];
});
_c = PerformanceDashboard;
/**
 * Simple memory trend visualization
 */ function MemoryTrendChart({ data }) {
    if (data.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center h-full text-xs text-gray-400",
            children: "No memory data"
        }, void 0, false, {
            fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
            lineNumber: 221,
            columnNumber: 7
        }, this);
    }
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-end justify-between h-full",
        children: data.map((value, index)=>{
            const height = (value - min) / range * 100;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `w-1 rounded-t ${value > max * 0.8 ? 'bg-red-400' : value > max * 0.6 ? 'bg-yellow-400' : 'bg-green-400'}`,
                style: {
                    height: `${Math.max(height, 10)}%`
                },
                title: `${value.toFixed(1)}MB`
            }, index, false, {
                fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
                lineNumber: 236,
                columnNumber: 11
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/src/app/tools/editor/components/PerformanceDashboard.tsx",
        lineNumber: 232,
        columnNumber: 5
    }, this);
}
_c1 = MemoryTrendChart;
var _c, _c1;
__turbopack_context__.k.register(_c, "PerformanceDashboard");
__turbopack_context__.k.register(_c1, "MemoryTrendChart");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/tools/editor/components/VersionControlLayout.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "VersionControlLayout": (()=>VersionControlLayout)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$components$2f$VersionSelector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tools/editor/components/VersionSelector.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$hooks$2f$useCellLineData$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tools/editor/hooks/useCellLineData.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$utils$2f$diffAlgorithm$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tools/editor/utils/diffAlgorithm.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$components$2f$VirtualizedDiffViewer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tools/editor/components/VirtualizedDiffViewer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$hooks$2f$usePerformanceOptimization$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tools/editor/hooks/usePerformanceOptimization.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$hooks$2f$useDebouncedOperations$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tools/editor/hooks/useDebouncedOperations.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$components$2f$PerformanceDashboard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tools/editor/components/PerformanceDashboard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$utils$2f$performanceMonitor$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tools/editor/utils/performanceMonitor.ts [app-client] (ecmascript)");
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
;
;
function VersionControlLayout({ onComparisonReady, onDiffReady, className = '' }) {
    _s();
    const { cellLines } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$hooks$2f$useCellLineData$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCellLineData"])();
    // Performance optimization hooks
    const [perfState, perfActions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$hooks$2f$usePerformanceOptimization$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePerformanceOptimization"])();
    const { computeOptimizedDiff } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$hooks$2f$usePerformanceOptimization$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOptimizedDiff"])();
    // Use refs to stabilize callback functions and prevent constant re-runs
    const onComparisonReadyRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(onComparisonReady);
    const onDiffReadyRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(onDiffReady);
    const computeOptimizedDiffRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(computeOptimizedDiff);
    // Update refs when callbacks change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VersionControlLayout.useEffect": ()=>{
            onComparisonReadyRef.current = onComparisonReady;
        }
    }["VersionControlLayout.useEffect"], [
        onComparisonReady
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VersionControlLayout.useEffect": ()=>{
            onDiffReadyRef.current = onDiffReady;
        }
    }["VersionControlLayout.useEffect"], [
        onDiffReady
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VersionControlLayout.useEffect": ()=>{
            computeOptimizedDiffRef.current = computeOptimizedDiff;
        }
    }["VersionControlLayout.useEffect"], [
        computeOptimizedDiff
    ]);
    const [showPerfDashboard, setShowPerfDashboard] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        leftCellLine: null,
        leftVersion: null,
        rightCellLine: null,
        rightVersion: null,
        isScrollLocked: false,
        showDifferencesOnly: false,
        isLoading: {
            leftPanel: false,
            rightPanel: false
        }
    });
    const [leftVersions, setLeftVersions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [rightVersions, setRightVersions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [leftVersionData, setLeftVersionData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [rightVersionData, setRightVersionData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [diffResults, setDiffResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Format cell lines for dropdown options
    const cellLineOptions = cellLines.map((cellLine)=>({
            id: cellLine.CellLine_hpscreg_id,
            label: cellLine.CellLine_hpscreg_id
        }));
    // Format versions for dropdown options
    const formatVersionOptions = (versions)=>{
        return versions.map((version)=>({
                id: version.version_number.toString(),
                label: `Version ${version.version_number}`,
                subtitle: new Date(version.created_on).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                })
            }));
    };
    // Debounced operations for better performance
    const [debouncedState, debouncedActions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$hooks$2f$useDebouncedOperations$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDebouncedOperations"])({
        "VersionControlLayout.useDebouncedOperations": // Version selection handler
        (cellLineId, versionId, panel)=>{
            actuallyFetchVersionData(cellLineId, versionId, panel);
        }
    }["VersionControlLayout.useDebouncedOperations"], {
        "VersionControlLayout.useDebouncedOperations": // Filter handler
        (showDifferencesOnly)=>{
            setState({
                "VersionControlLayout.useDebouncedOperations": (prev)=>({
                        ...prev,
                        showDifferencesOnly
                    })
            }["VersionControlLayout.useDebouncedOperations"]);
        }
    }["VersionControlLayout.useDebouncedOperations"]);
    // Fetch versions for a specific cell line with performance tracking
    const fetchVersions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "VersionControlLayout.useCallback[fetchVersions]": async (cellLineId, panel)=>{
            if (!cellLineId) return;
            const startTiming = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$utils$2f$performanceMonitor$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["performanceMonitor"].startTiming('fetchVersions', {
                cellLineId,
                panel
            });
            setState({
                "VersionControlLayout.useCallback[fetchVersions]": (prev)=>({
                        ...prev,
                        isLoading: {
                            ...prev.isLoading,
                            [`${panel}Panel`]: true
                        }
                    })
            }["VersionControlLayout.useCallback[fetchVersions]"]);
            setError(null);
            try {
                const response = await fetch(`http://localhost:8000/api/editor/celllines/${cellLineId}/versions/`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch versions: ${response.statusText}`);
                }
                const data = await response.json();
                const versions = data.versions || [];
                if (panel === 'left') {
                    setLeftVersions(versions);
                } else {
                    setRightVersions(versions);
                }
                const duration = startTiming();
                console.log(`📋 Fetched ${versions.length} versions in ${duration.toFixed(2)}ms`);
            } catch (err) {
                startTiming();
                setError(err instanceof Error ? err.message : 'Failed to fetch versions');
            } finally{
                setState({
                    "VersionControlLayout.useCallback[fetchVersions]": (prev)=>({
                            ...prev,
                            isLoading: {
                                ...prev.isLoading,
                                [`${panel}Panel`]: false
                            }
                        })
                }["VersionControlLayout.useCallback[fetchVersions]"]);
            }
        }
    }["VersionControlLayout.useCallback[fetchVersions]"], []);
    // Fetch specific version data with caching
    const actuallyFetchVersionData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "VersionControlLayout.useCallback[actuallyFetchVersionData]": async (cellLineId, versionNumber, panel)=>{
            if (!cellLineId || !versionNumber) return;
            setState({
                "VersionControlLayout.useCallback[actuallyFetchVersionData]": (prev)=>({
                        ...prev,
                        isLoading: {
                            ...prev.isLoading,
                            [`${panel}Panel`]: true
                        }
                    })
            }["VersionControlLayout.useCallback[actuallyFetchVersionData]"]);
            setError(null);
            try {
                // Use cached version data
                const versionData = await perfActions.getCachedVersion(cellLineId, versionNumber);
                if (panel === 'left') {
                    setLeftVersionData(versionData);
                } else {
                    setRightVersionData(versionData);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch version data');
            } finally{
                setState({
                    "VersionControlLayout.useCallback[actuallyFetchVersionData]": (prev)=>({
                            ...prev,
                            isLoading: {
                                ...prev.isLoading,
                                [`${panel}Panel`]: false
                            }
                        })
                }["VersionControlLayout.useCallback[actuallyFetchVersionData]"]);
            }
        }
    }["VersionControlLayout.useCallback[actuallyFetchVersionData]"], [
        perfActions
    ]);
    // Original fetch function for non-debounced calls
    const fetchVersionData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "VersionControlLayout.useCallback[fetchVersionData]": async (cellLineId, versionNumber, panel)=>{
            return actuallyFetchVersionData(cellLineId, versionNumber, panel);
        }
    }["VersionControlLayout.useCallback[fetchVersionData]"], [
        actuallyFetchVersionData
    ]);
    // Handle cell line selection
    const handleCellLineSelect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "VersionControlLayout.useCallback[handleCellLineSelect]": (panel, cellLineId)=>{
            setState({
                "VersionControlLayout.useCallback[handleCellLineSelect]": (prev)=>({
                        ...prev,
                        [`${panel}CellLine`]: cellLineId,
                        [`${panel}Version`]: null
                    })
            }["VersionControlLayout.useCallback[handleCellLineSelect]"]);
            // Clear version data for this panel
            if (panel === 'left') {
                setLeftVersionData(null);
                setLeftVersions([]);
            } else {
                setRightVersionData(null);
                setRightVersions([]);
            }
            // Fetch versions for the selected cell line
            fetchVersions(cellLineId, panel);
        }
    }["VersionControlLayout.useCallback[handleCellLineSelect]"], [
        fetchVersions
    ]);
    // Handle version selection with debouncing
    const handleVersionSelect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "VersionControlLayout.useCallback[handleVersionSelect]": (panel, versionId)=>{
            setState({
                "VersionControlLayout.useCallback[handleVersionSelect]": (prev)=>({
                        ...prev,
                        [`${panel}Version`]: versionId
                    })
            }["VersionControlLayout.useCallback[handleVersionSelect]"]);
            const cellLineId = panel === 'left' ? state.leftCellLine : state.rightCellLine;
            if (cellLineId) {
                // Use debounced version selection for better performance
                debouncedActions.debouncedVersionSelect(cellLineId, versionId, panel);
            }
        }
    }["VersionControlLayout.useCallback[handleVersionSelect]"], [
        state.leftCellLine,
        state.rightCellLine,
        debouncedActions
    ]);
    // Toggle scroll lock
    const handleToggleScrollLock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "VersionControlLayout.useCallback[handleToggleScrollLock]": ()=>{
            setState({
                "VersionControlLayout.useCallback[handleToggleScrollLock]": (prev)=>({
                        ...prev,
                        isScrollLocked: !prev.isScrollLocked
                    })
            }["VersionControlLayout.useCallback[handleToggleScrollLock]"]);
        }
    }["VersionControlLayout.useCallback[handleToggleScrollLock]"], []);
    // Toggle show differences only with debouncing
    const handleToggleShowDifferences = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "VersionControlLayout.useCallback[handleToggleShowDifferences]": ()=>{
            const newValue = !state.showDifferencesOnly;
            // Use debounced filter for better performance
            debouncedActions.debouncedFilter(newValue);
        }
    }["VersionControlLayout.useCallback[handleToggleShowDifferences]"], [
        state.showDifferencesOnly,
        debouncedActions
    ]);
    // Handle diff results from DiffEngine
    const handleDiffReady = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "VersionControlLayout.useCallback[handleDiffReady]": (diff)=>{
            setDiffResults(diff);
            if (onDiffReady) {
                onDiffReady(diff);
            }
        }
    }["VersionControlLayout.useCallback[handleDiffReady]"], [
        onDiffReady
    ]);
    const handleDiffError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "VersionControlLayout.useCallback[handleDiffError]": (errorMessage)=>{
            setError(errorMessage);
            setDiffResults(null);
        }
    }["VersionControlLayout.useCallback[handleDiffError]"], []);
    // Notify parent when comparison is ready
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VersionControlLayout.useEffect": ()=>{
            if (leftVersionData && rightVersionData && onComparisonReady) {
                onComparisonReady(leftVersionData, rightVersionData);
            }
        }
    }["VersionControlLayout.useEffect"], [
        leftVersionData,
        rightVersionData,
        onComparisonReady
    ]);
    // Compute diff when both versions are available with caching
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VersionControlLayout.useEffect": ()=>{
            if (leftVersionData && rightVersionData && state.leftVersion && state.rightVersion) {
                setDiffResults(null); // Clear previous results
                // Use optimized diff computation with caching
                const computeDiff = {
                    "VersionControlLayout.useEffect.computeDiff": async ()=>{
                        try {
                            const diff = await computeOptimizedDiffRef.current(leftVersionData, rightVersionData, `${state.leftCellLine}:${state.leftVersion}`, `${state.rightCellLine}:${state.rightVersion}`, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$utils$2f$diffAlgorithm$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateStructuredDiff"]);
                            setDiffResults(diff);
                            // Notify parent components using stable refs
                            if (onComparisonReadyRef.current) {
                                onComparisonReadyRef.current(leftVersionData, rightVersionData);
                            }
                            if (onDiffReadyRef.current) {
                                onDiffReadyRef.current(diff);
                            }
                        } catch (error) {
                            console.error('Diff computation failed:', error);
                            setError('Failed to compute differences');
                        }
                    }
                }["VersionControlLayout.useEffect.computeDiff"];
                computeDiff();
            } else {
                setDiffResults(null);
            }
        }
    }["VersionControlLayout.useEffect"], [
        leftVersionData,
        rightVersionData,
        state.leftVersion,
        state.rightVersion,
        state.leftCellLine,
        state.rightCellLine
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `bg-white border border-gray-200 rounded-lg shadow-sm h-full w-full flex flex-col ${className}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-b border-gray-200 px-6 py-4 flex-shrink-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-end",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center space-x-3",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center bg-gray-100 rounded-lg p-1 gap-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>debouncedActions.debouncedFilter(false),
                                    className: `px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 hover:ring-2 hover:ring-blue-500 hover:ring-opacity-50 hover:ring-offset-1 ${!state.showDifferencesOnly ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`,
                                    children: "Show All"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
                                    lineNumber: 336,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>debouncedActions.debouncedFilter(true),
                                    className: `px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 hover:ring-2 hover:ring-blue-500 hover:ring-opacity-50 hover:ring-offset-1 ${state.showDifferencesOnly ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "w-4 h-4 mr-1.5 inline",
                                            fill: "none",
                                            stroke: "currentColor",
                                            viewBox: "0 0 24 24",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2,
                                                d: "M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
                                                lineNumber: 355,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
                                            lineNumber: 354,
                                            columnNumber: 17
                                        }, this),
                                        "Show Differences"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
                                    lineNumber: 346,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
                            lineNumber: 335,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
                        lineNumber: 333,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
                    lineNumber: 331,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
                lineNumber: 330,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-md flex-shrink-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex",
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
                                    fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
                                    lineNumber: 370,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
                                lineNumber: 369,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
                            lineNumber: 368,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "ml-3",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-red-800",
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
                                lineNumber: 374,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
                            lineNumber: 373,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "ml-auto pl-3",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setError(null),
                                className: "text-red-400 hover:text-red-600",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "h-5 w-5",
                                    fill: "currentColor",
                                    viewBox: "0 0 20 20",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        fillRule: "evenodd",
                                        d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
                                        clipRule: "evenodd"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
                                        lineNumber: 382,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
                                    lineNumber: 381,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
                                lineNumber: 377,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
                            lineNumber: 376,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
                    lineNumber: 367,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
                lineNumber: 366,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-b border-gray-200 p-6 flex-shrink-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-4 gap-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$components$2f$VersionSelector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VersionSelector"], {
                                label: "Select cell line:",
                                placeholder: "Choose cell line...",
                                options: cellLineOptions,
                                value: state.leftCellLine,
                                onChange: (value)=>handleCellLineSelect('left', value),
                                searchable: true
                            }, void 0, false, {
                                fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
                                lineNumber: 395,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
                            lineNumber: 394,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$components$2f$VersionSelector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VersionSelector"], {
                                label: "Select version:",
                                placeholder: "Select version...",
                                options: formatVersionOptions(leftVersions),
                                value: state.leftVersion,
                                onChange: (value)=>handleVersionSelect('left', value),
                                disabled: !state.leftCellLine,
                                isLoading: state.isLoading.leftPanel
                            }, void 0, false, {
                                fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
                                lineNumber: 407,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
                            lineNumber: 406,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$components$2f$VersionSelector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VersionSelector"], {
                                label: "Select cell line:",
                                placeholder: "Choose cell line...",
                                options: cellLineOptions,
                                value: state.rightCellLine,
                                onChange: (value)=>handleCellLineSelect('right', value),
                                searchable: true
                            }, void 0, false, {
                                fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
                                lineNumber: 420,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
                            lineNumber: 419,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$components$2f$VersionSelector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VersionSelector"], {
                                label: "Select version:",
                                placeholder: "Select version...",
                                options: formatVersionOptions(rightVersions),
                                value: state.rightVersion,
                                onChange: (value)=>handleVersionSelect('right', value),
                                disabled: !state.rightCellLine,
                                isLoading: state.isLoading.rightPanel
                            }, void 0, false, {
                                fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
                                lineNumber: 432,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
                            lineNumber: 431,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
                    lineNumber: 392,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
                lineNumber: 391,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "diff-container flex-1 flex flex-col min-h-0 w-full px-0 pb-0",
                children: state.isLoading.leftPanel || state.isLoading.rightPanel ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center flex-1",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center text-gray-600",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"
                            }, void 0, false, {
                                fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
                                lineNumber: 450,
                                columnNumber: 15
                            }, this),
                            "Loading version data..."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
                        lineNumber: 449,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
                    lineNumber: 448,
                    columnNumber: 11
                }, this) : !leftVersionData || !rightVersionData || !diffResults ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center flex-1",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center text-gray-500",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                className: "mx-auto h-12 w-12 text-gray-400 mb-4",
                                fill: "none",
                                viewBox: "0 0 24 24",
                                stroke: "currentColor",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 2,
                                    d: "M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
                                    lineNumber: 458,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
                                lineNumber: 457,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm",
                                children: "Select cell lines and versions to compare"
                            }, void 0, false, {
                                fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
                                lineNumber: 460,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-gray-400 mt-1",
                                children: "Choose from the dropdowns above"
                            }, void 0, false, {
                                fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
                                lineNumber: 461,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
                        lineNumber: 456,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
                    lineNumber: 455,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "diff-viewer-container flex-1 flex flex-col bg-white border border-gray-200 rounded-lg min-h-0 w-full mx-6 mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "diff-header grid grid-cols-4 gap-6 p-4 pr-6 bg-gray-50 border-b border-gray-200 rounded-t-lg flex-shrink-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm font-medium text-gray-700",
                                    children: "Field Name"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
                                    lineNumber: 468,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm font-medium text-gray-700",
                                    children: " "
                                }, void 0, false, {
                                    fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
                                    lineNumber: 469,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm font-medium text-gray-700 text-center",
                                    children: [
                                        state.leftCellLine,
                                        " (v",
                                        state.leftVersion,
                                        ")"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
                                    lineNumber: 470,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm font-medium text-gray-700 text-center",
                                    children: [
                                        state.rightCellLine,
                                        " (v",
                                        state.rightVersion,
                                        ")"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
                                    lineNumber: 473,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
                            lineNumber: 467,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 min-h-0",
                            style: {
                                height: '700px'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$components$2f$VirtualizedDiffViewer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VirtualizedDiffViewer"], {
                                diffResults: diffResults,
                                showDifferencesOnly: state.showDifferencesOnly,
                                leftCellLine: state.leftCellLine,
                                leftVersion: state.leftVersion,
                                rightCellLine: state.rightCellLine,
                                rightVersion: state.rightVersion
                            }, void 0, false, {
                                fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
                                lineNumber: 480,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
                            lineNumber: 479,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
                    lineNumber: 465,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
                lineNumber: 446,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$components$2f$PerformanceDashboard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PerformanceDashboard"], {
                isVisible: showPerfDashboard,
                onToggleVisibility: ()=>setShowPerfDashboard(!showPerfDashboard)
            }, void 0, false, {
                fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
                lineNumber: 494,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/tools/editor/components/VersionControlLayout.tsx",
        lineNumber: 328,
        columnNumber: 5
    }, this);
}
_s(VersionControlLayout, "xQqCOiTUhoXlyTwNMYGLGKjuwkQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$hooks$2f$useCellLineData$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCellLineData"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$hooks$2f$usePerformanceOptimization$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePerformanceOptimization"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$hooks$2f$usePerformanceOptimization$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOptimizedDiff"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$hooks$2f$useDebouncedOperations$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDebouncedOperations"]
    ];
});
_c = VersionControlLayout;
var _c;
__turbopack_context__.k.register(_c, "VersionControlLayout");
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
"[project]/src/app/tools/editor/components/EditorContainer.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "EditorContainer": (()=>EditorContainer)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$components$2f$VersionControlLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tools/editor/components/VersionControlLayout.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$components$2f$CustomCellLineEditor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tools/editor/components/CustomCellLineEditor.tsx [app-client] (ecmascript)");
'use client';
;
;
;
function EditorContent() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container mx-auto px-4 py-8 w-full",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-lg shadow-sm border border-gray-200",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-6 border-b border-gray-200",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-lg font-medium text-gray-900 mb-2",
                                        children: "Version Control Interface"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/tools/editor/components/EditorContainer.tsx",
                                        lineNumber: 18,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-gray-600",
                                        children: "Compare cell line versions side-by-side"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/tools/editor/components/EditorContainer.tsx",
                                        lineNumber: 21,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/tools/editor/components/EditorContainer.tsx",
                                lineNumber: 17,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$components$2f$VersionControlLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VersionControlLayout"], {}, void 0, false, {
                                fileName: "[project]/src/app/tools/editor/components/EditorContainer.tsx",
                                lineNumber: 25,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/tools/editor/components/EditorContainer.tsx",
                        lineNumber: 16,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-lg font-medium text-gray-900 mb-2",
                                        children: "Edit Cell Lines"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/tools/editor/components/EditorContainer.tsx",
                                        lineNumber: 31,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-gray-600",
                                        children: "Select and edit cell line metadata"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/tools/editor/components/EditorContainer.tsx",
                                        lineNumber: 34,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/tools/editor/components/EditorContainer.tsx",
                                lineNumber: 30,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tools$2f$editor$2f$components$2f$CustomCellLineEditor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                fileName: "[project]/src/app/tools/editor/components/EditorContainer.tsx",
                                lineNumber: 38,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/tools/editor/components/EditorContainer.tsx",
                        lineNumber: 29,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/tools/editor/components/EditorContainer.tsx",
                lineNumber: 13,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/tools/editor/components/EditorContainer.tsx",
            lineNumber: 12,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/tools/editor/components/EditorContainer.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
_c = EditorContent;
function EditorContainer({ initialCellLineId }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EditorContent, {}, void 0, false, {
        fileName: "[project]/src/app/tools/editor/components/EditorContainer.tsx",
        lineNumber: 47,
        columnNumber: 10
    }, this);
}
_c1 = EditorContainer;
var _c, _c1;
__turbopack_context__.k.register(_c, "EditorContent");
__turbopack_context__.k.register(_c1, "EditorContainer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_2bf6b2c7._.js.map