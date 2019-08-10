/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ImageService } from '../services/image.service';
import { HttpClient } from '@angular/common/http';
var GalleryComponent = /** @class */ (function () {
    function GalleryComponent(imageService, http, changeDetectorRef) {
        this.imageService = imageService;
        this.http = http;
        this.changeDetectorRef = changeDetectorRef;
        this.gallery = [];
        this.imageDataStaticPath = 'assets/img/gallery/';
        this.imageDataCompletePath = '';
        this.dataFileName = 'data.json';
        this.images = [];
        this.minimalQualityCategory = 'preview_xxs';
        this.rowIndex = 0;
        this.rightArrowInactive = false;
        this.leftArrowInactive = false;
        this.providedImageMargin = 3;
        this.providedImageSize = 7;
        this.providedGalleryName = '';
        this.providedMetadataUri = undefined;
        this.rowsPerPage = 200;
        this.viewerChange = new EventEmitter();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    GalleryComponent.prototype.triggerCycle = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.scaleGallery();
    };
    /**
     * @param {?} event
     * @return {?}
     */
    GalleryComponent.prototype.windowResize = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.render();
    };
    /**
     * @return {?}
     */
    GalleryComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.fetchDataAndRender();
        this.viewerSubscription = this.imageService.showImageViewerChanged$
            .subscribe((/**
         * @param {?} visibility
         * @return {?}
         */
        function (visibility) { return _this.viewerChange.emit(visibility); }));
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    GalleryComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        // input params changed
        if (changes['providedGalleryName'] != undefined) {
            this.fetchDataAndRender();
        }
        else {
            this.render();
        }
    };
    /**
     * @return {?}
     */
    GalleryComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        if (this.viewerSubscription) {
            this.viewerSubscription.unsubscribe();
        }
    };
    /**
     * @param {?} img
     * @return {?}
     */
    GalleryComponent.prototype.openImageViewer = /**
     * @param {?} img
     * @return {?}
     */
    function (img) {
        this.imageService.updateImages(this.images);
        this.imageService.updateSelectedImageIndex(this.images.indexOf(img));
        this.imageService.showImageViewer(true);
    };
    /**
     * direction (-1: left, 1: right)
     */
    /**
     * direction (-1: left, 1: right)
     * @param {?} direction
     * @return {?}
     */
    GalleryComponent.prototype.navigate = /**
     * direction (-1: left, 1: right)
     * @param {?} direction
     * @return {?}
     */
    function (direction) {
        if ((direction === 1 && this.rowIndex < this.gallery.length - this.rowsPerPage)
            || (direction === -1 && this.rowIndex > 0)) {
            this.rowIndex += (this.rowsPerPage * direction);
        }
        this.refreshNavigationErrorState();
    };
    /**
     * @return {?}
     */
    GalleryComponent.prototype.calcImageMargin = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var galleryWidth = this.getGalleryWidth();
        /** @type {?} */
        var ratio = galleryWidth / 1920;
        return Math.round(Math.max(1, this.providedImageMargin * ratio));
    };
    /**
     * @private
     * @return {?}
     */
    GalleryComponent.prototype.fetchDataAndRender = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        this.imageDataCompletePath = this.providedMetadataUri;
        if (!this.providedMetadataUri) {
            this.imageDataCompletePath = this.providedGalleryName !== '' ?
                this.imageDataStaticPath + this.providedGalleryName + "/" + this.dataFileName :
                this.imageDataStaticPath + this.dataFileName;
        }
        this.http.get(this.imageDataCompletePath)
            .subscribe((/**
         * @param {?} data
         * @return {?}
         */
        function (data) {
            _this.images = data;
            _this.imageService.updateImages(_this.images);
            _this.images.forEach((/**
             * @param {?} image
             * @return {?}
             */
            function (image) {
                image['galleryImageLoaded'] = false;
                image['viewerImageLoaded'] = false;
                image['srcAfterFocus'] = '';
            }));
            // twice, single leads to different strange browser behaviour
            _this.render();
            _this.render();
        }), (/**
         * @param {?} err
         * @return {?}
         */
        function (err) {
            if (_this.providedMetadataUri) {
                console.error("Provided endpoint '" + _this.providedMetadataUri + "' did not serve metadata correctly or in the expected format.\n      See here for more information: https://github.com/BenjaminBrandmeier/angular2-image-gallery/blob/master/docs/externalDataSource.md,\n      Original error: " + err);
            }
            else {
                console.error("Did you run the convert script from angular2-image-gallery for your images first? Original error: " + err);
            }
        }), (/**
         * @return {?}
         */
        function () { return undefined; }));
    };
    /**
     * @private
     * @return {?}
     */
    GalleryComponent.prototype.render = /**
     * @private
     * @return {?}
     */
    function () {
        this.gallery = [];
        /** @type {?} */
        var tempRow = [this.images[0]];
        /** @type {?} */
        var currentRowIndex = 0;
        /** @type {?} */
        var i = 0;
        for (i; i < this.images.length; i++) {
            while (this.images[i + 1] && this.shouldAddCandidate(tempRow, this.images[i + 1])) {
                i++;
            }
            if (this.images[i + 1]) {
                tempRow.pop();
            }
            this.gallery[currentRowIndex++] = tempRow;
            tempRow = [this.images[i + 1]];
        }
        this.scaleGallery();
    };
    /**
     * @private
     * @param {?} imgRow
     * @param {?} candidate
     * @return {?}
     */
    GalleryComponent.prototype.shouldAddCandidate = /**
     * @private
     * @param {?} imgRow
     * @param {?} candidate
     * @return {?}
     */
    function (imgRow, candidate) {
        /** @type {?} */
        var oldDifference = this.calcIdealHeight() - this.calcRowHeight(imgRow);
        imgRow.push(candidate);
        /** @type {?} */
        var newDifference = this.calcIdealHeight() - this.calcRowHeight(imgRow);
        return Math.abs(oldDifference) > Math.abs(newDifference);
    };
    /**
     * @private
     * @param {?} imgRow
     * @return {?}
     */
    GalleryComponent.prototype.calcRowHeight = /**
     * @private
     * @param {?} imgRow
     * @return {?}
     */
    function (imgRow) {
        /** @type {?} */
        var originalRowWidth = this.calcOriginalRowWidth(imgRow);
        /** @type {?} */
        var ratio = (this.getGalleryWidth() - (imgRow.length - 1) * this.calcImageMargin()) / originalRowWidth;
        /** @type {?} */
        var rowHeight = imgRow[0][this.minimalQualityCategory]['height'] * ratio;
        return rowHeight;
    };
    /**
     * @private
     * @param {?} imgRow
     * @return {?}
     */
    GalleryComponent.prototype.calcOriginalRowWidth = /**
     * @private
     * @param {?} imgRow
     * @return {?}
     */
    function (imgRow) {
        var _this = this;
        /** @type {?} */
        var originalRowWidth = 0;
        imgRow.forEach((/**
         * @param {?} img
         * @return {?}
         */
        function (img) {
            /** @type {?} */
            var individualRatio = _this.calcIdealHeight() / img[_this.minimalQualityCategory]['height'];
            img[_this.minimalQualityCategory]['width'] = img[_this.minimalQualityCategory]['width'] * individualRatio;
            img[_this.minimalQualityCategory]['height'] = _this.calcIdealHeight();
            originalRowWidth += img[_this.minimalQualityCategory]['width'];
        }));
        return originalRowWidth;
    };
    /**
     * @private
     * @return {?}
     */
    GalleryComponent.prototype.calcIdealHeight = /**
     * @private
     * @return {?}
     */
    function () {
        return this.getGalleryWidth() / (80 / this.providedImageSize) + 100;
    };
    /**
     * @private
     * @return {?}
     */
    GalleryComponent.prototype.getGalleryWidth = /**
     * @private
     * @return {?}
     */
    function () {
        if (this.galleryContainer.nativeElement.clientWidth === 0) {
            // for IE11
            return this.galleryContainer.nativeElement.scrollWidth;
        }
        return this.galleryContainer.nativeElement.clientWidth;
    };
    /**
     * @private
     * @return {?}
     */
    GalleryComponent.prototype.scaleGallery = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var imageCounter = 0;
        /** @type {?} */
        var maximumGalleryImageHeight = 0;
        this.gallery.slice(this.rowIndex, this.rowIndex + this.rowsPerPage)
            .forEach((/**
         * @param {?} imgRow
         * @return {?}
         */
        function (imgRow) {
            /** @type {?} */
            var originalRowWidth = _this.calcOriginalRowWidth(imgRow);
            if (imgRow !== _this.gallery[_this.gallery.length - 1]) {
                /** @type {?} */
                var ratio_1 = (_this.getGalleryWidth() - (imgRow.length - 1) * _this.calcImageMargin()) / originalRowWidth;
                imgRow.forEach((/**
                 * @param {?} img
                 * @return {?}
                 */
                function (img) {
                    img['width'] = img[_this.minimalQualityCategory]['width'] * ratio_1;
                    img['height'] = img[_this.minimalQualityCategory]['height'] * ratio_1;
                    maximumGalleryImageHeight = Math.max(maximumGalleryImageHeight, img['height']);
                    _this.checkForAsyncLoading(img, imageCounter++);
                }));
            }
            else {
                imgRow.forEach((/**
                 * @param {?} img
                 * @return {?}
                 */
                function (img) {
                    img.width = img[_this.minimalQualityCategory]['width'];
                    img.height = img[_this.minimalQualityCategory]['height'];
                    maximumGalleryImageHeight = Math.max(maximumGalleryImageHeight, img['height']);
                    _this.checkForAsyncLoading(img, imageCounter++);
                }));
            }
        }));
        this.minimalQualityCategory = maximumGalleryImageHeight > 375 ? 'preview_xs' : 'preview_xxs';
        this.refreshNavigationErrorState();
        this.changeDetectorRef.detectChanges();
    };
    /**
     * @private
     * @param {?} image
     * @param {?} imageCounter
     * @return {?}
     */
    GalleryComponent.prototype.checkForAsyncLoading = /**
     * @private
     * @param {?} image
     * @param {?} imageCounter
     * @return {?}
     */
    function (image, imageCounter) {
        /** @type {?} */
        var imageElements = this.imageElements.toArray();
        if (image['galleryImageLoaded'] ||
            (imageElements.length > 0 &&
                imageElements[imageCounter] &&
                this.isScrolledIntoView(imageElements[imageCounter].nativeElement))) {
            image['galleryImageLoaded'] = true;
            image['srcAfterFocus'] = image[this.minimalQualityCategory]['path'];
        }
        else {
            image['srcAfterFocus'] = '';
        }
    };
    /**
     * @private
     * @param {?} element
     * @return {?}
     */
    GalleryComponent.prototype.isScrolledIntoView = /**
     * @private
     * @param {?} element
     * @return {?}
     */
    function (element) {
        /** @type {?} */
        var elementTop = element.getBoundingClientRect().top;
        /** @type {?} */
        var elementBottom = element.getBoundingClientRect().bottom;
        return elementTop < window.innerHeight && elementBottom >= 0 && (elementBottom > 0 || elementTop > 0);
    };
    /**
     * @private
     * @return {?}
     */
    GalleryComponent.prototype.refreshNavigationErrorState = /**
     * @private
     * @return {?}
     */
    function () {
        this.leftArrowInactive = this.rowIndex == 0;
        this.rightArrowInactive = this.rowIndex > (this.gallery.length - this.rowsPerPage);
    };
    GalleryComponent.decorators = [
        { type: Component, args: [{
                    selector: 'gallery',
                    template: "<div #galleryContainer class=\"galleryContainer\">\n    <div class=\"innerGalleryContainer\">\n        <div *ngFor='let imgrow of gallery | slice:rowIndex:rowIndex+rowsPerPage; let i = index'\n             class=\"imagerow\"\n             [style.margin-bottom.px]=\"calcImageMargin()\">\n            <img #imageElement\n                 *ngFor='let img of imgrow; let j = index'\n                 class=\"thumbnail\"\n                 [style.width.px]=\"img['width']\"\n                 [style.height.px]=\"img['height']\"\n                 (click)=\"openImageViewer(img)\"\n                 [src]=\"img['srcAfterFocus']\"\n                 [style.background]=\"img.dominantColor\"\n                 [style.margin-right.px]=\"calcImageMargin()\"/>\n        </div>\n    </div>\n\n    <div class=\"pagerContainer\" *ngIf=\"(!rightArrowInactive || !leftArrowInactive)\">\n        <img [ngClass]=\"{'inactive': leftArrowInactive}\" class=\"pager left\"\n             src=\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaWQ9IkxheWVyXzEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ4IDQ4OyIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgNDggNDgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxnPjxwYXRoIGQ9Ik0yNCw0NkMxMS45LDQ2LDIsMzYuMSwyLDI0UzExLjksMiwyNCwyczIyLDkuOSwyMiwyMlMzNi4xLDQ2LDI0LDQ2eiBNMjQsNEMxMyw0LDQsMTMsNCwyNGMwLDExLDksMjAsMjAsMjAgICBjMTEsMCwyMC05LDIwLTIwQzQ0LDEzLDM1LDQsMjQsNHoiLz48L2c+PGc+PHBvbHlnb24gcG9pbnRzPSIyNy42LDM2LjcgMTQuOSwyNCAyNy42LDExLjMgMjkuMSwxMi43IDE3LjgsMjQgMjkuMSwzNS4zICAiLz48L2c+PC9zdmc+\"\n             (click)=\"navigate(-1)\"/>\n        <img [ngClass]=\"{'inactive': rightArrowInactive}\" class=\"pager right\"\n             src=\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaWQ9IkxheWVyXzEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ4IDQ4OyIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgNDggNDgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxnPjxwYXRoIGQ9Ik0yNCw0NkMxMS45LDQ2LDIsMzYuMSwyLDI0UzExLjksMiwyNCwyczIyLDkuOSwyMiwyMlMzNi4xLDQ2LDI0LDQ2eiBNMjQsNEMxMyw0LDQsMTMsNCwyNHM5LDIwLDIwLDIwczIwLTksMjAtMjAgICBTMzUsNCwyNCw0eiIvPjwvZz48Zz48cG9seWdvbiBwb2ludHM9IjIxLjQsMzYuNyAxOS45LDM1LjMgMzEuMiwyNCAxOS45LDEyLjcgMjEuNCwxMS4zIDM0LjEsMjQgICIvPjwvZz48L3N2Zz4=\"\n             (click)=\"navigate(1)\"/>\n    </div>\n</div>\n\n<viewer></viewer>\n",
                    styles: [".innerGalleryContainer{position:relative}.galleryContainer{height:100%;width:100%;overflow:hidden}.innerGalleryContainer img:last-child{margin-right:-1px!important}.galleryContainer img:hover{-webkit-filter:brightness(50%);filter:brightness(50%);transition:.2s ease-out;cursor:pointer}.imagerow{margin-right:1px;overflow:hidden;display:flex}::-webkit-scrollbar{display:none}.asyncLoadingContainer{position:absolute;background-color:transparent;height:0;width:0;bottom:120px}.pagerContainer{margin:40px auto;width:180px}.pager{display:block;height:60px}@media (max-width:700px){.pagerContainer{margin:40px auto;width:150px}.pager{display:block;height:45px}}.pager.inactive{opacity:.15}.pager.left{float:left}.pager.right{float:right}"]
                }] }
    ];
    /** @nocollapse */
    GalleryComponent.ctorParameters = function () { return [
        { type: ImageService },
        { type: HttpClient },
        { type: ChangeDetectorRef }
    ]; };
    GalleryComponent.propDecorators = {
        providedImageMargin: [{ type: Input, args: ['flexBorderSize',] }],
        providedImageSize: [{ type: Input, args: ['flexImageSize',] }],
        providedGalleryName: [{ type: Input, args: ['galleryName',] }],
        providedMetadataUri: [{ type: Input, args: ['metadataUri',] }],
        rowsPerPage: [{ type: Input, args: ['maxRowsPerPage',] }],
        viewerChange: [{ type: Output }],
        galleryContainer: [{ type: ViewChild, args: ['galleryContainer', { static: true },] }],
        imageElements: [{ type: ViewChildren, args: ['imageElement',] }],
        triggerCycle: [{ type: HostListener, args: ['window:scroll', ['$event'],] }],
        windowResize: [{ type: HostListener, args: ['window:resize', ['$event'],] }]
    };
    return GalleryComponent;
}());
export { GalleryComponent };
if (false) {
    /** @type {?} */
    GalleryComponent.prototype.gallery;
    /** @type {?} */
    GalleryComponent.prototype.imageDataStaticPath;
    /** @type {?} */
    GalleryComponent.prototype.imageDataCompletePath;
    /** @type {?} */
    GalleryComponent.prototype.dataFileName;
    /** @type {?} */
    GalleryComponent.prototype.images;
    /** @type {?} */
    GalleryComponent.prototype.minimalQualityCategory;
    /** @type {?} */
    GalleryComponent.prototype.viewerSubscription;
    /** @type {?} */
    GalleryComponent.prototype.rowIndex;
    /** @type {?} */
    GalleryComponent.prototype.rightArrowInactive;
    /** @type {?} */
    GalleryComponent.prototype.leftArrowInactive;
    /** @type {?} */
    GalleryComponent.prototype.providedImageMargin;
    /** @type {?} */
    GalleryComponent.prototype.providedImageSize;
    /** @type {?} */
    GalleryComponent.prototype.providedGalleryName;
    /** @type {?} */
    GalleryComponent.prototype.providedMetadataUri;
    /** @type {?} */
    GalleryComponent.prototype.rowsPerPage;
    /** @type {?} */
    GalleryComponent.prototype.viewerChange;
    /** @type {?} */
    GalleryComponent.prototype.galleryContainer;
    /** @type {?} */
    GalleryComponent.prototype.imageElements;
    /** @type {?} */
    GalleryComponent.prototype.imageService;
    /** @type {?} */
    GalleryComponent.prototype.http;
    /** @type {?} */
    GalleryComponent.prototype.changeDetectorRef;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FsbGVyeS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyMi1pbWFnZS1nYWxsZXJ5LyIsInNvdXJjZXMiOlsibGliL2dhbGxlcnkvZ2FsbGVyeS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFDTCxpQkFBaUIsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQ3BFLEtBQUssRUFBZ0MsTUFBTSxFQUFFLFNBQVMsRUFBaUIsU0FBUyxFQUFFLFlBQVksRUFDL0YsTUFBTSxlQUFlLENBQUE7QUFDdEIsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDJCQUEyQixDQUFBO0FBRXhELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQTtBQUVqRDtJQW9DSSwwQkFBbUIsWUFBMEIsRUFBUyxJQUFnQixFQUFTLGlCQUFvQztRQUFoRyxpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUFTLFNBQUksR0FBSixJQUFJLENBQVk7UUFBUyxzQkFBaUIsR0FBakIsaUJBQWlCLENBQW1CO1FBOUJuSCxZQUFPLEdBQWUsRUFBRSxDQUFBO1FBQ3hCLHdCQUFtQixHQUFXLHFCQUFxQixDQUFBO1FBQ25ELDBCQUFxQixHQUFXLEVBQUUsQ0FBQTtRQUNsQyxpQkFBWSxHQUFXLFdBQVcsQ0FBQTtRQUNsQyxXQUFNLEdBQWUsRUFBRSxDQUFBO1FBQ3ZCLDJCQUFzQixHQUFHLGFBQWEsQ0FBQTtRQUV0QyxhQUFRLEdBQVcsQ0FBQyxDQUFBO1FBQ3BCLHVCQUFrQixHQUFZLEtBQUssQ0FBQTtRQUNuQyxzQkFBaUIsR0FBWSxLQUFLLENBQUE7UUFFVCx3QkFBbUIsR0FBVyxDQUFDLENBQUE7UUFDaEMsc0JBQWlCLEdBQVcsQ0FBQyxDQUFBO1FBQy9CLHdCQUFtQixHQUFXLEVBQUUsQ0FBQTtRQUNoQyx3QkFBbUIsR0FBVyxTQUFTLENBQUE7UUFDcEMsZ0JBQVcsR0FBVyxHQUFHLENBQUE7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aUJBQWlCOzs7c0NBd0JkLEtBQUssU0FBQyxnQkFBZ0I7b0NBQ3RCLEtBQUssU0FBQyxlQUFlO3NDQUNyQixLQUFLLFNBQUMsYUFBYTtzQ0FDbkIsS0FBSyxTQUFDLGFBQWE7OEJBQ25CLEtBQUssU0FBQyxnQkFBZ0I7K0JBRXRCLE1BQU07bUNBRU4sU0FBUyxTQUFDLGtCQUFrQixFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTtnQ0FDOUMsWUFBWSxTQUFDLGNBQWM7K0JBRTNCLFlBQVksU0FBQyxlQUFlLEVBQUUsQ0FBQyxRQUFRLENBQUM7K0JBSXhDLFlBQVksU0FBQyxlQUFlLEVBQUUsQ0FBQyxRQUFRLENBQUM7O0lBZ043Qyx1QkFBQztDQUFBLEFBaFBELElBZ1BDO1NBM09ZLGdCQUFnQjs7O0lBQ3pCLG1DQUF3Qjs7SUFDeEIsK0NBQW1EOztJQUNuRCxpREFBa0M7O0lBQ2xDLHdDQUFrQzs7SUFDbEMsa0NBQXVCOztJQUN2QixrREFBc0M7O0lBQ3RDLDhDQUFnQzs7SUFDaEMsb0NBQW9COztJQUNwQiw4Q0FBbUM7O0lBQ25DLDZDQUFrQzs7SUFFbEMsK0NBQXdEOztJQUN4RCw2Q0FBcUQ7O0lBQ3JELCtDQUFzRDs7SUFDdEQsK0NBQTZEOztJQUM3RCx1Q0FBa0Q7O0lBRWxELHdDQUFvRDs7SUFFcEQsNENBQTZFOztJQUM3RSx5Q0FBMkQ7O0lBVS9DLHdDQUFpQzs7SUFBRSxnQ0FBdUI7O0lBQUUsNkNBQTJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsIENvbXBvbmVudCwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBIb3N0TGlzdGVuZXIsXG4gIElucHV0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgT25Jbml0LCBPdXRwdXQsIFF1ZXJ5TGlzdCwgU2ltcGxlQ2hhbmdlcywgVmlld0NoaWxkLCBWaWV3Q2hpbGRyZW5cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSdcbmltcG9ydCB7IEltYWdlU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL2ltYWdlLnNlcnZpY2UnXG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzL2ludGVybmFsL1N1YnNjcmlwdGlvbidcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCdcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdnYWxsZXJ5JyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vZ2FsbGVyeS5jb21wb25lbnQuaHRtbCcsXG4gICAgc3R5bGVVcmxzOiBbJy4vZ2FsbGVyeS5jb21wb25lbnQuY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgR2FsbGVyeUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBPbkNoYW5nZXMge1xuICAgIGdhbGxlcnk6IEFycmF5PGFueT4gPSBbXVxuICAgIGltYWdlRGF0YVN0YXRpY1BhdGg6IHN0cmluZyA9ICdhc3NldHMvaW1nL2dhbGxlcnkvJ1xuICAgIGltYWdlRGF0YUNvbXBsZXRlUGF0aDogc3RyaW5nID0gJydcbiAgICBkYXRhRmlsZU5hbWU6IHN0cmluZyA9ICdkYXRhLmpzb24nXG4gICAgaW1hZ2VzOiBBcnJheTxhbnk+ID0gW11cbiAgICBtaW5pbWFsUXVhbGl0eUNhdGVnb3J5ID0gJ3ByZXZpZXdfeHhzJ1xuICAgIHZpZXdlclN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uXG4gICAgcm93SW5kZXg6IG51bWJlciA9IDBcbiAgICByaWdodEFycm93SW5hY3RpdmU6IGJvb2xlYW4gPSBmYWxzZVxuICAgIGxlZnRBcnJvd0luYWN0aXZlOiBib29sZWFuID0gZmFsc2VcblxuICAgIEBJbnB1dCgnZmxleEJvcmRlclNpemUnKSBwcm92aWRlZEltYWdlTWFyZ2luOiBudW1iZXIgPSAzXG4gICAgQElucHV0KCdmbGV4SW1hZ2VTaXplJykgcHJvdmlkZWRJbWFnZVNpemU6IG51bWJlciA9IDdcbiAgICBASW5wdXQoJ2dhbGxlcnlOYW1lJykgcHJvdmlkZWRHYWxsZXJ5TmFtZTogc3RyaW5nID0gJydcbiAgICBASW5wdXQoJ21ldGFkYXRhVXJpJykgcHJvdmlkZWRNZXRhZGF0YVVyaTogc3RyaW5nID0gdW5kZWZpbmVkXG4gICAgQElucHV0KCdtYXhSb3dzUGVyUGFnZScpIHJvd3NQZXJQYWdlOiBudW1iZXIgPSAyMDBcblxuICAgIEBPdXRwdXQoKSB2aWV3ZXJDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KClcblxuICAgIEBWaWV3Q2hpbGQoJ2dhbGxlcnlDb250YWluZXInLCB7IHN0YXRpYzogdHJ1ZSB9KSBnYWxsZXJ5Q29udGFpbmVyOiBFbGVtZW50UmVmXG4gICAgQFZpZXdDaGlsZHJlbignaW1hZ2VFbGVtZW50JykgaW1hZ2VFbGVtZW50czogUXVlcnlMaXN0PGFueT5cblxuICAgIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzpzY3JvbGwnLCBbJyRldmVudCddKSB0cmlnZ2VyQ3ljbGUoZXZlbnQ6IGFueSk6IHZvaWQge1xuICAgICAgICB0aGlzLnNjYWxlR2FsbGVyeSgpXG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcignd2luZG93OnJlc2l6ZScsIFsnJGV2ZW50J10pIHdpbmRvd1Jlc2l6ZShldmVudDogYW55KTogdm9pZCB7XG4gICAgICAgIHRoaXMucmVuZGVyKClcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgaW1hZ2VTZXJ2aWNlOiBJbWFnZVNlcnZpY2UsIHB1YmxpYyBodHRwOiBIdHRwQ2xpZW50LCBwdWJsaWMgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmKSB7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZmV0Y2hEYXRhQW5kUmVuZGVyKClcbiAgICAgICAgdGhpcy52aWV3ZXJTdWJzY3JpcHRpb24gPSB0aGlzLmltYWdlU2VydmljZS5zaG93SW1hZ2VWaWV3ZXJDaGFuZ2VkJFxuICAgICAgICAgICAgLnN1YnNjcmliZSgodmlzaWJpbGl0eTogYm9vbGVhbikgPT4gdGhpcy52aWV3ZXJDaGFuZ2UuZW1pdCh2aXNpYmlsaXR5KSlcbiAgICB9XG5cbiAgICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgICAgIC8vIGlucHV0IHBhcmFtcyBjaGFuZ2VkXG4gICAgICAgIGlmIChjaGFuZ2VzWydwcm92aWRlZEdhbGxlcnlOYW1lJ10gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmZldGNoRGF0YUFuZFJlbmRlcigpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlbmRlcigpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMudmlld2VyU3Vic2NyaXB0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnZpZXdlclN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvcGVuSW1hZ2VWaWV3ZXIoaW1nOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5pbWFnZVNlcnZpY2UudXBkYXRlSW1hZ2VzKHRoaXMuaW1hZ2VzKVxuICAgICAgICB0aGlzLmltYWdlU2VydmljZS51cGRhdGVTZWxlY3RlZEltYWdlSW5kZXgodGhpcy5pbWFnZXMuaW5kZXhPZihpbWcpKVxuICAgICAgICB0aGlzLmltYWdlU2VydmljZS5zaG93SW1hZ2VWaWV3ZXIodHJ1ZSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBkaXJlY3Rpb24gKC0xOiBsZWZ0LCAxOiByaWdodClcbiAgICAgKi9cbiAgICBuYXZpZ2F0ZShkaXJlY3Rpb246IG51bWJlcik6IHZvaWQge1xuICAgICAgICBpZiAoKGRpcmVjdGlvbiA9PT0gMSAmJiB0aGlzLnJvd0luZGV4IDwgdGhpcy5nYWxsZXJ5Lmxlbmd0aCAtIHRoaXMucm93c1BlclBhZ2UpXG4gICAgICAgICAgICB8fCAoZGlyZWN0aW9uID09PSAtMSAmJiB0aGlzLnJvd0luZGV4ID4gMCkpIHtcbiAgICAgICAgICAgIHRoaXMucm93SW5kZXggKz0gKHRoaXMucm93c1BlclBhZ2UgKiBkaXJlY3Rpb24pXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZWZyZXNoTmF2aWdhdGlvbkVycm9yU3RhdGUoKVxuICAgIH1cblxuICAgIGNhbGNJbWFnZU1hcmdpbigpOiBudW1iZXIge1xuICAgICAgICBjb25zdCBnYWxsZXJ5V2lkdGggPSB0aGlzLmdldEdhbGxlcnlXaWR0aCgpXG4gICAgICAgIGNvbnN0IHJhdGlvID0gZ2FsbGVyeVdpZHRoIC8gMTkyMFxuICAgICAgICByZXR1cm4gTWF0aC5yb3VuZChNYXRoLm1heCgxLCB0aGlzLnByb3ZpZGVkSW1hZ2VNYXJnaW4gKiByYXRpbykpXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmZXRjaERhdGFBbmRSZW5kZXIoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuaW1hZ2VEYXRhQ29tcGxldGVQYXRoID0gdGhpcy5wcm92aWRlZE1ldGFkYXRhVXJpXG5cbiAgICAgICAgaWYgKCF0aGlzLnByb3ZpZGVkTWV0YWRhdGFVcmkpIHtcbiAgICAgICAgICAgIHRoaXMuaW1hZ2VEYXRhQ29tcGxldGVQYXRoID0gdGhpcy5wcm92aWRlZEdhbGxlcnlOYW1lICE9PSAnJyA/XG4gICAgICAgICAgICAgICAgYCR7dGhpcy5pbWFnZURhdGFTdGF0aWNQYXRoICsgdGhpcy5wcm92aWRlZEdhbGxlcnlOYW1lfS8ke3RoaXMuZGF0YUZpbGVOYW1lfWAgOlxuICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2VEYXRhU3RhdGljUGF0aCArIHRoaXMuZGF0YUZpbGVOYW1lXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmh0dHAuZ2V0KHRoaXMuaW1hZ2VEYXRhQ29tcGxldGVQYXRoKVxuICAgICAgICAgIC5zdWJzY3JpYmUoXG4gICAgICAgICAgICAoZGF0YTogQXJyYXk8YW55PikgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmltYWdlcyA9IGRhdGFcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbWFnZVNlcnZpY2UudXBkYXRlSW1hZ2VzKHRoaXMuaW1hZ2VzKVxuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2VzLmZvckVhY2goaW1hZ2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIGltYWdlWydnYWxsZXJ5SW1hZ2VMb2FkZWQnXSA9IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgaW1hZ2VbJ3ZpZXdlckltYWdlTG9hZGVkJ10gPSBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgIGltYWdlWydzcmNBZnRlckZvY3VzJ10gPSAnJ1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAvLyB0d2ljZSwgc2luZ2xlIGxlYWRzIHRvIGRpZmZlcmVudCBzdHJhbmdlIGJyb3dzZXIgYmVoYXZpb3VyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyKClcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXIoKVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGVyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnByb3ZpZGVkTWV0YWRhdGFVcmkpIHtcbiAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBQcm92aWRlZCBlbmRwb2ludCAnJHt0aGlzLnByb3ZpZGVkTWV0YWRhdGFVcml9JyBkaWQgbm90IHNlcnZlIG1ldGFkYXRhIGNvcnJlY3RseSBvciBpbiB0aGUgZXhwZWN0ZWQgZm9ybWF0LlxuICAgICAgU2VlIGhlcmUgZm9yIG1vcmUgaW5mb3JtYXRpb246IGh0dHBzOi8vZ2l0aHViLmNvbS9CZW5qYW1pbkJyYW5kbWVpZXIvYW5ndWxhcjItaW1hZ2UtZ2FsbGVyeS9ibG9iL21hc3Rlci9kb2NzL2V4dGVybmFsRGF0YVNvdXJjZS5tZCxcbiAgICAgIE9yaWdpbmFsIGVycm9yOiAke2Vycn1gKVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgRGlkIHlvdSBydW4gdGhlIGNvbnZlcnQgc2NyaXB0IGZyb20gYW5ndWxhcjItaW1hZ2UtZ2FsbGVyeSBmb3IgeW91ciBpbWFnZXMgZmlyc3Q/IE9yaWdpbmFsIGVycm9yOiAke2Vycn1gKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAoKSA9PiB1bmRlZmluZWQpXG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZW5kZXIoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZ2FsbGVyeSA9IFtdXG5cbiAgICAgICAgbGV0IHRlbXBSb3cgPSBbdGhpcy5pbWFnZXNbMF1dXG4gICAgICAgIGxldCBjdXJyZW50Um93SW5kZXggPSAwXG4gICAgICAgIGxldCBpID0gMFxuXG4gICAgICAgIGZvciAoaTsgaSA8IHRoaXMuaW1hZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB3aGlsZSAodGhpcy5pbWFnZXNbaSArIDFdICYmIHRoaXMuc2hvdWxkQWRkQ2FuZGlkYXRlKHRlbXBSb3csIHRoaXMuaW1hZ2VzW2kgKyAxXSkpIHtcbiAgICAgICAgICAgICAgICBpKytcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmltYWdlc1tpICsgMV0pIHtcbiAgICAgICAgICAgICAgICB0ZW1wUm93LnBvcCgpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmdhbGxlcnlbY3VycmVudFJvd0luZGV4KytdID0gdGVtcFJvd1xuXG4gICAgICAgICAgICB0ZW1wUm93ID0gW3RoaXMuaW1hZ2VzW2kgKyAxXV1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2NhbGVHYWxsZXJ5KClcbiAgICB9XG5cbiAgICBwcml2YXRlIHNob3VsZEFkZENhbmRpZGF0ZShpbWdSb3c6IEFycmF5PGFueT4sIGNhbmRpZGF0ZTogYW55KTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IG9sZERpZmZlcmVuY2UgPSB0aGlzLmNhbGNJZGVhbEhlaWdodCgpIC0gdGhpcy5jYWxjUm93SGVpZ2h0KGltZ1JvdylcbiAgICAgICAgaW1nUm93LnB1c2goY2FuZGlkYXRlKVxuICAgICAgICBjb25zdCBuZXdEaWZmZXJlbmNlID0gdGhpcy5jYWxjSWRlYWxIZWlnaHQoKSAtIHRoaXMuY2FsY1Jvd0hlaWdodChpbWdSb3cpXG5cbiAgICAgICAgcmV0dXJuIE1hdGguYWJzKG9sZERpZmZlcmVuY2UpID4gTWF0aC5hYnMobmV3RGlmZmVyZW5jZSlcbiAgICB9XG5cbiAgICBwcml2YXRlIGNhbGNSb3dIZWlnaHQoaW1nUm93OiBBcnJheTxhbnk+KTogbnVtYmVyIHtcbiAgICAgICAgY29uc3Qgb3JpZ2luYWxSb3dXaWR0aCA9IHRoaXMuY2FsY09yaWdpbmFsUm93V2lkdGgoaW1nUm93KVxuXG4gICAgICAgIGNvbnN0IHJhdGlvID0gKHRoaXMuZ2V0R2FsbGVyeVdpZHRoKCkgLSAoaW1nUm93Lmxlbmd0aCAtIDEpICogdGhpcy5jYWxjSW1hZ2VNYXJnaW4oKSkgLyBvcmlnaW5hbFJvd1dpZHRoXG4gICAgICAgIGNvbnN0IHJvd0hlaWdodCA9IGltZ1Jvd1swXVt0aGlzLm1pbmltYWxRdWFsaXR5Q2F0ZWdvcnldWydoZWlnaHQnXSAqIHJhdGlvXG5cbiAgICAgICAgcmV0dXJuIHJvd0hlaWdodFxuICAgIH1cblxuICAgIHByaXZhdGUgY2FsY09yaWdpbmFsUm93V2lkdGgoaW1nUm93OiBBcnJheTxhbnk+KTogbnVtYmVyIHtcbiAgICAgICAgbGV0IG9yaWdpbmFsUm93V2lkdGggPSAwXG4gICAgICAgIGltZ1Jvdy5mb3JFYWNoKGltZyA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbmRpdmlkdWFsUmF0aW8gPSB0aGlzLmNhbGNJZGVhbEhlaWdodCgpIC8gaW1nW3RoaXMubWluaW1hbFF1YWxpdHlDYXRlZ29yeV1bJ2hlaWdodCddXG4gICAgICAgICAgICBpbWdbdGhpcy5taW5pbWFsUXVhbGl0eUNhdGVnb3J5XVsnd2lkdGgnXSA9IGltZ1t0aGlzLm1pbmltYWxRdWFsaXR5Q2F0ZWdvcnldWyd3aWR0aCddICogaW5kaXZpZHVhbFJhdGlvXG4gICAgICAgICAgICBpbWdbdGhpcy5taW5pbWFsUXVhbGl0eUNhdGVnb3J5XVsnaGVpZ2h0J10gPSB0aGlzLmNhbGNJZGVhbEhlaWdodCgpXG4gICAgICAgICAgICBvcmlnaW5hbFJvd1dpZHRoICs9IGltZ1t0aGlzLm1pbmltYWxRdWFsaXR5Q2F0ZWdvcnldWyd3aWR0aCddXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIG9yaWdpbmFsUm93V2lkdGhcbiAgICB9XG5cbiAgICBwcml2YXRlIGNhbGNJZGVhbEhlaWdodCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRHYWxsZXJ5V2lkdGgoKSAvICg4MCAvIHRoaXMucHJvdmlkZWRJbWFnZVNpemUpICsgMTAwXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRHYWxsZXJ5V2lkdGgoKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHRoaXMuZ2FsbGVyeUNvbnRhaW5lci5uYXRpdmVFbGVtZW50LmNsaWVudFdpZHRoID09PSAwKSB7XG4gICAgICAgICAgICAvLyBmb3IgSUUxMVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2FsbGVyeUNvbnRhaW5lci5uYXRpdmVFbGVtZW50LnNjcm9sbFdpZHRoXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZ2FsbGVyeUNvbnRhaW5lci5uYXRpdmVFbGVtZW50LmNsaWVudFdpZHRoXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzY2FsZUdhbGxlcnkoKTogdm9pZCB7XG4gICAgICAgIGxldCBpbWFnZUNvdW50ZXIgPSAwXG4gICAgICAgIGxldCBtYXhpbXVtR2FsbGVyeUltYWdlSGVpZ2h0ID0gMFxuXG4gICAgICAgIHRoaXMuZ2FsbGVyeS5zbGljZSh0aGlzLnJvd0luZGV4LCB0aGlzLnJvd0luZGV4ICsgdGhpcy5yb3dzUGVyUGFnZSlcbiAgICAgICAgICAuZm9yRWFjaChpbWdSb3cgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxSb3dXaWR0aCA9IHRoaXMuY2FsY09yaWdpbmFsUm93V2lkdGgoaW1nUm93KVxuXG4gICAgICAgICAgICBpZiAoaW1nUm93ICE9PSB0aGlzLmdhbGxlcnlbdGhpcy5nYWxsZXJ5Lmxlbmd0aCAtIDFdKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmF0aW8gPSAodGhpcy5nZXRHYWxsZXJ5V2lkdGgoKSAtIChpbWdSb3cubGVuZ3RoIC0gMSkgKiB0aGlzLmNhbGNJbWFnZU1hcmdpbigpKSAvIG9yaWdpbmFsUm93V2lkdGhcblxuICAgICAgICAgICAgICAgIGltZ1Jvdy5mb3JFYWNoKChpbWc6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpbWdbJ3dpZHRoJ10gPSBpbWdbdGhpcy5taW5pbWFsUXVhbGl0eUNhdGVnb3J5XVsnd2lkdGgnXSAqIHJhdGlvXG4gICAgICAgICAgICAgICAgICAgIGltZ1snaGVpZ2h0J10gPSBpbWdbdGhpcy5taW5pbWFsUXVhbGl0eUNhdGVnb3J5XVsnaGVpZ2h0J10gKiByYXRpb1xuICAgICAgICAgICAgICAgICAgICBtYXhpbXVtR2FsbGVyeUltYWdlSGVpZ2h0ID0gTWF0aC5tYXgobWF4aW11bUdhbGxlcnlJbWFnZUhlaWdodCwgaW1nWydoZWlnaHQnXSlcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGVja0ZvckFzeW5jTG9hZGluZyhpbWcsIGltYWdlQ291bnRlcisrKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGltZ1Jvdy5mb3JFYWNoKChpbWc6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpbWcud2lkdGggPSBpbWdbdGhpcy5taW5pbWFsUXVhbGl0eUNhdGVnb3J5XVsnd2lkdGgnXVxuICAgICAgICAgICAgICAgICAgICBpbWcuaGVpZ2h0ID0gaW1nW3RoaXMubWluaW1hbFF1YWxpdHlDYXRlZ29yeV1bJ2hlaWdodCddXG4gICAgICAgICAgICAgICAgICAgIG1heGltdW1HYWxsZXJ5SW1hZ2VIZWlnaHQgPSBNYXRoLm1heChtYXhpbXVtR2FsbGVyeUltYWdlSGVpZ2h0LCBpbWdbJ2hlaWdodCddKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZWNrRm9yQXN5bmNMb2FkaW5nKGltZywgaW1hZ2VDb3VudGVyKyspXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICB0aGlzLm1pbmltYWxRdWFsaXR5Q2F0ZWdvcnkgPSBtYXhpbXVtR2FsbGVyeUltYWdlSGVpZ2h0ID4gMzc1ID8gJ3ByZXZpZXdfeHMnIDogJ3ByZXZpZXdfeHhzJ1xuICAgICAgICB0aGlzLnJlZnJlc2hOYXZpZ2F0aW9uRXJyb3JTdGF0ZSgpXG5cbiAgICAgICAgdGhpcy5jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKClcbiAgICB9XG5cbiAgICBwcml2YXRlIGNoZWNrRm9yQXN5bmNMb2FkaW5nKGltYWdlOiBhbnksIGltYWdlQ291bnRlcjogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGltYWdlRWxlbWVudHMgPSB0aGlzLmltYWdlRWxlbWVudHMudG9BcnJheSgpXG5cbiAgICAgICAgaWYgKGltYWdlWydnYWxsZXJ5SW1hZ2VMb2FkZWQnXSB8fFxuICAgICAgICAgICAgKGltYWdlRWxlbWVudHMubGVuZ3RoID4gMCAmJlxuICAgICAgICAgICAgICBpbWFnZUVsZW1lbnRzW2ltYWdlQ291bnRlcl0gJiZcbiAgICAgICAgICAgICAgdGhpcy5pc1Njcm9sbGVkSW50b1ZpZXcoaW1hZ2VFbGVtZW50c1tpbWFnZUNvdW50ZXJdLm5hdGl2ZUVsZW1lbnQpKSkge1xuICAgICAgICAgICAgaW1hZ2VbJ2dhbGxlcnlJbWFnZUxvYWRlZCddID0gdHJ1ZVxuICAgICAgICAgICAgaW1hZ2VbJ3NyY0FmdGVyRm9jdXMnXSA9IGltYWdlW3RoaXMubWluaW1hbFF1YWxpdHlDYXRlZ29yeV1bJ3BhdGgnXVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW1hZ2VbJ3NyY0FmdGVyRm9jdXMnXSA9ICcnXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGlzU2Nyb2xsZWRJbnRvVmlldyhlbGVtZW50OiBhbnkpOiBib29sZWFuIHtcbiAgICAgICAgY29uc3QgZWxlbWVudFRvcCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wXG4gICAgICAgIGNvbnN0IGVsZW1lbnRCb3R0b20gPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmJvdHRvbVxuXG4gICAgICAgIHJldHVybiBlbGVtZW50VG9wIDwgd2luZG93LmlubmVySGVpZ2h0ICYmIGVsZW1lbnRCb3R0b20gPj0gMCAmJiAoZWxlbWVudEJvdHRvbSA+IDAgfHwgZWxlbWVudFRvcCA+IDApXG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZWZyZXNoTmF2aWdhdGlvbkVycm9yU3RhdGUoKTogdm9pZCB7XG4gICAgICAgIHRoaXMubGVmdEFycm93SW5hY3RpdmUgPSB0aGlzLnJvd0luZGV4ID09IDBcbiAgICAgICAgdGhpcy5yaWdodEFycm93SW5hY3RpdmUgPSB0aGlzLnJvd0luZGV4ID4gKHRoaXMuZ2FsbGVyeS5sZW5ndGggLSB0aGlzLnJvd3NQZXJQYWdlKVxuICAgIH1cbn1cbiJdfQ==