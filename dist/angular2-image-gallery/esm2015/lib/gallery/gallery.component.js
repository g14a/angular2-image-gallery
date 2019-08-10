/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ImageService } from '../services/image.service';
import { HttpClient } from '@angular/common/http';
export class GalleryComponent {
    /**
     * @param {?} imageService
     * @param {?} http
     * @param {?} changeDetectorRef
     */
    constructor(imageService, http, changeDetectorRef) {
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
    triggerCycle(event) {
        this.scaleGallery();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    windowResize(event) {
        this.render();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.fetchDataAndRender();
        this.viewerSubscription = this.imageService.showImageViewerChanged$
            .subscribe((/**
         * @param {?} visibility
         * @return {?}
         */
        (visibility) => this.viewerChange.emit(visibility)));
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        // input params changed
        if (changes['providedGalleryName'] != undefined) {
            this.fetchDataAndRender();
        }
        else {
            this.render();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.viewerSubscription) {
            this.viewerSubscription.unsubscribe();
        }
    }
    /**
     * @param {?} img
     * @return {?}
     */
    openImageViewer(img) {
        this.imageService.updateImages(this.images);
        this.imageService.updateSelectedImageIndex(this.images.indexOf(img));
        this.imageService.showImageViewer(true);
    }
    /**
     * direction (-1: left, 1: right)
     * @param {?} direction
     * @return {?}
     */
    navigate(direction) {
        if ((direction === 1 && this.rowIndex < this.gallery.length - this.rowsPerPage)
            || (direction === -1 && this.rowIndex > 0)) {
            this.rowIndex += (this.rowsPerPage * direction);
        }
        this.refreshNavigationErrorState();
    }
    /**
     * @return {?}
     */
    calcImageMargin() {
        /** @type {?} */
        const galleryWidth = this.getGalleryWidth();
        /** @type {?} */
        const ratio = galleryWidth / 1920;
        return Math.round(Math.max(1, this.providedImageMargin * ratio));
    }
    /**
     * @private
     * @return {?}
     */
    fetchDataAndRender() {
        this.imageDataCompletePath = this.providedMetadataUri;
        if (!this.providedMetadataUri) {
            this.imageDataCompletePath = this.providedGalleryName !== '' ?
                `${this.imageDataStaticPath + this.providedGalleryName}/${this.dataFileName}` :
                this.imageDataStaticPath + this.dataFileName;
        }
        this.http.get(this.imageDataCompletePath)
            .subscribe((/**
         * @param {?} data
         * @return {?}
         */
        (data) => {
            this.images = data;
            this.imageService.updateImages(this.images);
            this.images.forEach((/**
             * @param {?} image
             * @return {?}
             */
            image => {
                image['galleryImageLoaded'] = false;
                image['viewerImageLoaded'] = false;
                image['srcAfterFocus'] = '';
            }));
            // twice, single leads to different strange browser behaviour
            this.render();
            this.render();
        }), (/**
         * @param {?} err
         * @return {?}
         */
        err => {
            if (this.providedMetadataUri) {
                console.error(`Provided endpoint '${this.providedMetadataUri}' did not serve metadata correctly or in the expected format.
      See here for more information: https://github.com/BenjaminBrandmeier/angular2-image-gallery/blob/master/docs/externalDataSource.md,
      Original error: ${err}`);
            }
            else {
                console.error(`Did you run the convert script from angular2-image-gallery for your images first? Original error: ${err}`);
            }
        }), (/**
         * @return {?}
         */
        () => undefined));
    }
    /**
     * @private
     * @return {?}
     */
    render() {
        this.gallery = [];
        /** @type {?} */
        let tempRow = [this.images[0]];
        /** @type {?} */
        let currentRowIndex = 0;
        /** @type {?} */
        let i = 0;
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
    }
    /**
     * @private
     * @param {?} imgRow
     * @param {?} candidate
     * @return {?}
     */
    shouldAddCandidate(imgRow, candidate) {
        /** @type {?} */
        const oldDifference = this.calcIdealHeight() - this.calcRowHeight(imgRow);
        imgRow.push(candidate);
        /** @type {?} */
        const newDifference = this.calcIdealHeight() - this.calcRowHeight(imgRow);
        return Math.abs(oldDifference) > Math.abs(newDifference);
    }
    /**
     * @private
     * @param {?} imgRow
     * @return {?}
     */
    calcRowHeight(imgRow) {
        /** @type {?} */
        const originalRowWidth = this.calcOriginalRowWidth(imgRow);
        /** @type {?} */
        const ratio = (this.getGalleryWidth() - (imgRow.length - 1) * this.calcImageMargin()) / originalRowWidth;
        /** @type {?} */
        const rowHeight = imgRow[0][this.minimalQualityCategory]['height'] * ratio;
        return rowHeight;
    }
    /**
     * @private
     * @param {?} imgRow
     * @return {?}
     */
    calcOriginalRowWidth(imgRow) {
        /** @type {?} */
        let originalRowWidth = 0;
        imgRow.forEach((/**
         * @param {?} img
         * @return {?}
         */
        img => {
            /** @type {?} */
            const individualRatio = this.calcIdealHeight() / img[this.minimalQualityCategory]['height'];
            img[this.minimalQualityCategory]['width'] = img[this.minimalQualityCategory]['width'] * individualRatio;
            img[this.minimalQualityCategory]['height'] = this.calcIdealHeight();
            originalRowWidth += img[this.minimalQualityCategory]['width'];
        }));
        return originalRowWidth;
    }
    /**
     * @private
     * @return {?}
     */
    calcIdealHeight() {
        return this.getGalleryWidth() / (80 / this.providedImageSize) + 100;
    }
    /**
     * @private
     * @return {?}
     */
    getGalleryWidth() {
        if (this.galleryContainer.nativeElement.clientWidth === 0) {
            // for IE11
            return this.galleryContainer.nativeElement.scrollWidth;
        }
        return this.galleryContainer.nativeElement.clientWidth;
    }
    /**
     * @private
     * @return {?}
     */
    scaleGallery() {
        /** @type {?} */
        let imageCounter = 0;
        /** @type {?} */
        let maximumGalleryImageHeight = 0;
        this.gallery.slice(this.rowIndex, this.rowIndex + this.rowsPerPage)
            .forEach((/**
         * @param {?} imgRow
         * @return {?}
         */
        imgRow => {
            /** @type {?} */
            const originalRowWidth = this.calcOriginalRowWidth(imgRow);
            if (imgRow !== this.gallery[this.gallery.length - 1]) {
                /** @type {?} */
                const ratio = (this.getGalleryWidth() - (imgRow.length - 1) * this.calcImageMargin()) / originalRowWidth;
                imgRow.forEach((/**
                 * @param {?} img
                 * @return {?}
                 */
                (img) => {
                    img['width'] = img[this.minimalQualityCategory]['width'] * ratio;
                    img['height'] = img[this.minimalQualityCategory]['height'] * ratio;
                    maximumGalleryImageHeight = Math.max(maximumGalleryImageHeight, img['height']);
                    this.checkForAsyncLoading(img, imageCounter++);
                }));
            }
            else {
                imgRow.forEach((/**
                 * @param {?} img
                 * @return {?}
                 */
                (img) => {
                    img.width = img[this.minimalQualityCategory]['width'];
                    img.height = img[this.minimalQualityCategory]['height'];
                    maximumGalleryImageHeight = Math.max(maximumGalleryImageHeight, img['height']);
                    this.checkForAsyncLoading(img, imageCounter++);
                }));
            }
        }));
        this.minimalQualityCategory = maximumGalleryImageHeight > 375 ? 'preview_xs' : 'preview_xxs';
        this.refreshNavigationErrorState();
        this.changeDetectorRef.detectChanges();
    }
    /**
     * @private
     * @param {?} image
     * @param {?} imageCounter
     * @return {?}
     */
    checkForAsyncLoading(image, imageCounter) {
        /** @type {?} */
        const imageElements = this.imageElements.toArray();
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
    }
    /**
     * @private
     * @param {?} element
     * @return {?}
     */
    isScrolledIntoView(element) {
        /** @type {?} */
        const elementTop = element.getBoundingClientRect().top;
        /** @type {?} */
        const elementBottom = element.getBoundingClientRect().bottom;
        return elementTop < window.innerHeight && elementBottom >= 0 && (elementBottom > 0 || elementTop > 0);
    }
    /**
     * @private
     * @return {?}
     */
    refreshNavigationErrorState() {
        this.leftArrowInactive = this.rowIndex == 0;
        this.rightArrowInactive = this.rowIndex > (this.gallery.length - this.rowsPerPage);
    }
}
GalleryComponent.decorators = [
    { type: Component, args: [{
                selector: 'gallery',
                template: "<div #galleryContainer class=\"galleryContainer\">\n    <div class=\"innerGalleryContainer\">\n        <div *ngFor='let imgrow of gallery | slice:rowIndex:rowIndex+rowsPerPage; let i = index'\n             class=\"imagerow\"\n             [style.margin-bottom.px]=\"calcImageMargin()\">\n            <img #imageElement\n                 *ngFor='let img of imgrow; let j = index'\n                 class=\"thumbnail\"\n                 [style.width.px]=\"img['width']\"\n                 [style.height.px]=\"img['height']\"\n                 (click)=\"openImageViewer(img)\"\n                 [src]=\"img['srcAfterFocus']\"\n                 [style.background]=\"img.dominantColor\"\n                 [style.margin-right.px]=\"calcImageMargin()\"/>\n        </div>\n    </div>\n\n    <div class=\"pagerContainer\" *ngIf=\"(!rightArrowInactive || !leftArrowInactive)\">\n        <img [ngClass]=\"{'inactive': leftArrowInactive}\" class=\"pager left\"\n             src=\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaWQ9IkxheWVyXzEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ4IDQ4OyIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgNDggNDgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxnPjxwYXRoIGQ9Ik0yNCw0NkMxMS45LDQ2LDIsMzYuMSwyLDI0UzExLjksMiwyNCwyczIyLDkuOSwyMiwyMlMzNi4xLDQ2LDI0LDQ2eiBNMjQsNEMxMyw0LDQsMTMsNCwyNGMwLDExLDksMjAsMjAsMjAgICBjMTEsMCwyMC05LDIwLTIwQzQ0LDEzLDM1LDQsMjQsNHoiLz48L2c+PGc+PHBvbHlnb24gcG9pbnRzPSIyNy42LDM2LjcgMTQuOSwyNCAyNy42LDExLjMgMjkuMSwxMi43IDE3LjgsMjQgMjkuMSwzNS4zICAiLz48L2c+PC9zdmc+\"\n             (click)=\"navigate(-1)\"/>\n        <img [ngClass]=\"{'inactive': rightArrowInactive}\" class=\"pager right\"\n             src=\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaWQ9IkxheWVyXzEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ4IDQ4OyIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgNDggNDgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxnPjxwYXRoIGQ9Ik0yNCw0NkMxMS45LDQ2LDIsMzYuMSwyLDI0UzExLjksMiwyNCwyczIyLDkuOSwyMiwyMlMzNi4xLDQ2LDI0LDQ2eiBNMjQsNEMxMyw0LDQsMTMsNCwyNHM5LDIwLDIwLDIwczIwLTksMjAtMjAgICBTMzUsNCwyNCw0eiIvPjwvZz48Zz48cG9seWdvbiBwb2ludHM9IjIxLjQsMzYuNyAxOS45LDM1LjMgMzEuMiwyNCAxOS45LDEyLjcgMjEuNCwxMS4zIDM0LjEsMjQgICIvPjwvZz48L3N2Zz4=\"\n             (click)=\"navigate(1)\"/>\n    </div>\n</div>\n\n<viewer></viewer>\n",
                styles: [".innerGalleryContainer{position:relative}.galleryContainer{height:100%;width:100%;overflow:hidden}.innerGalleryContainer img:last-child{margin-right:-1px!important}.galleryContainer img:hover{-webkit-filter:brightness(50%);filter:brightness(50%);transition:.2s ease-out;cursor:pointer}.imagerow{margin-right:1px;overflow:hidden;display:flex}::-webkit-scrollbar{display:none}.asyncLoadingContainer{position:absolute;background-color:transparent;height:0;width:0;bottom:120px}.pagerContainer{margin:40px auto;width:180px}.pager{display:block;height:60px}@media (max-width:700px){.pagerContainer{margin:40px auto;width:150px}.pager{display:block;height:45px}}.pager.inactive{opacity:.15}.pager.left{float:left}.pager.right{float:right}"]
            }] }
];
/** @nocollapse */
GalleryComponent.ctorParameters = () => [
    { type: ImageService },
    { type: HttpClient },
    { type: ChangeDetectorRef }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FsbGVyeS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyMi1pbWFnZS1nYWxsZXJ5LyIsInNvdXJjZXMiOlsibGliL2dhbGxlcnkvZ2FsbGVyeS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFDTCxpQkFBaUIsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQ3BFLEtBQUssRUFBZ0MsTUFBTSxFQUFFLFNBQVMsRUFBaUIsU0FBUyxFQUFFLFlBQVksRUFDL0YsTUFBTSxlQUFlLENBQUE7QUFDdEIsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDJCQUEyQixDQUFBO0FBRXhELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQTtBQU9qRCxNQUFNLE9BQU8sZ0JBQWdCOzs7Ozs7SUErQnpCLFlBQW1CLFlBQTBCLEVBQVMsSUFBZ0IsRUFBUyxpQkFBb0M7UUFBaEcsaUJBQVksR0FBWixZQUFZLENBQWM7UUFBUyxTQUFJLEdBQUosSUFBSSxDQUFZO1FBQVMsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFtQjtRQTlCbkgsWUFBTyxHQUFlLEVBQUUsQ0FBQTtRQUN4Qix3QkFBbUIsR0FBVyxxQkFBcUIsQ0FBQTtRQUNuRCwwQkFBcUIsR0FBVyxFQUFFLENBQUE7UUFDbEMsaUJBQVksR0FBVyxXQUFXLENBQUE7UUFDbEMsV0FBTSxHQUFlLEVBQUUsQ0FBQTtRQUN2QiwyQkFBc0IsR0FBRyxhQUFhLENBQUE7UUFFdEMsYUFBUSxHQUFXLENBQUMsQ0FBQTtRQUNwQix1QkFBa0IsR0FBWSxLQUFLLENBQUE7UUFDbkMsc0JBQWlCLEdBQVksS0FBSyxDQUFBO1FBRVQsd0JBQW1CLEdBQVcsQ0FBQyxDQUFBO1FBQ2hDLHNCQUFpQixHQUFXLENBQUMsQ0FBQTtRQUMvQix3QkFBbUIsR0FBVyxFQUFFLENBQUE7UUFDaEMsd0JBQW1CLEdBQVcsU0FBUyxDQUFBO1FBQ3BDLGdCQUFXLEdBQVcsR0FBRyxDQUFBO1FBRXhDLGlCQUFZLEdBQUcsSUFBSSxZQUFZLEVBQVcsQ0FBQTtJQWNwRCxDQUFDOzs7OztJQVQwQyxZQUFZLENBQUMsS0FBVTtRQUM5RCxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUE7SUFDdkIsQ0FBQzs7Ozs7SUFFMEMsWUFBWSxDQUFDLEtBQVU7UUFDOUQsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFBO0lBQ2pCLENBQUM7Ozs7SUFLRCxRQUFRO1FBQ0osSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUE7UUFDekIsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsdUJBQXVCO2FBQzlELFNBQVM7Ozs7UUFBQyxDQUFDLFVBQW1CLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFDLENBQUE7SUFDL0UsQ0FBQzs7Ozs7SUFFRCxXQUFXLENBQUMsT0FBc0I7UUFDOUIsdUJBQXVCO1FBQ3ZCLElBQUksT0FBTyxDQUFDLHFCQUFxQixDQUFDLElBQUksU0FBUyxFQUFFO1lBQzdDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFBO1NBQzVCO2FBQU07WUFDSCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUE7U0FDaEI7SUFDTCxDQUFDOzs7O0lBRUQsV0FBVztRQUNQLElBQUksSUFBSSxDQUFDLGtCQUFrQixFQUFFO1lBQ3pCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtTQUN4QztJQUNMLENBQUM7Ozs7O0lBRUQsZUFBZSxDQUFDLEdBQVE7UUFDcEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQzNDLElBQUksQ0FBQyxZQUFZLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtRQUNwRSxJQUFJLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUMzQyxDQUFDOzs7Ozs7SUFLRCxRQUFRLENBQUMsU0FBaUI7UUFDdEIsSUFBSSxDQUFDLFNBQVMsS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO2VBQ3hFLENBQUMsU0FBUyxLQUFLLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLEVBQUU7WUFDNUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEdBQUcsU0FBUyxDQUFDLENBQUE7U0FDbEQ7UUFDRCxJQUFJLENBQUMsMkJBQTJCLEVBQUUsQ0FBQTtJQUN0QyxDQUFDOzs7O0lBRUQsZUFBZTs7Y0FDTCxZQUFZLEdBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRTs7Y0FDckMsS0FBSyxHQUFHLFlBQVksR0FBRyxJQUFJO1FBQ2pDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsbUJBQW1CLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQTtJQUNwRSxDQUFDOzs7OztJQUVPLGtCQUFrQjtRQUN0QixJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFBO1FBRXJELElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUU7WUFDM0IsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQyxtQkFBbUIsS0FBSyxFQUFFLENBQUMsQ0FBQztnQkFDMUQsR0FBRyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO2dCQUMvRSxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQTtTQUNuRDtRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQzthQUN0QyxTQUFTOzs7O1FBQ1IsQ0FBQyxJQUFnQixFQUFFLEVBQUU7WUFDYixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQTtZQUNsQixJQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7WUFFM0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPOzs7O1lBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQzFCLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLEtBQUssQ0FBQTtnQkFDbkMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLEdBQUcsS0FBSyxDQUFBO2dCQUNsQyxLQUFLLENBQUMsZUFBZSxDQUFDLEdBQUcsRUFBRSxDQUFBO1lBQzdCLENBQUMsRUFBQyxDQUFBO1lBQ0YsNkRBQTZEO1lBQzdELElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQTtZQUNiLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQTtRQUNqQixDQUFDOzs7O1FBQ0gsR0FBRyxDQUFDLEVBQUU7WUFDQSxJQUFJLElBQUksQ0FBQyxtQkFBbUIsRUFBRTtnQkFDNUIsT0FBTyxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsSUFBSSxDQUFDLG1CQUFtQjs7d0JBRTFELEdBQUcsRUFBRSxDQUFDLENBQUE7YUFDVDtpQkFBTTtnQkFDSCxPQUFPLENBQUMsS0FBSyxDQUFDLHFHQUFxRyxHQUFHLEVBQUUsQ0FBQyxDQUFBO2FBQzVIO1FBQ1AsQ0FBQzs7O1FBQ0gsR0FBRyxFQUFFLENBQUMsU0FBUyxFQUFDLENBQUE7SUFDeEIsQ0FBQzs7Ozs7SUFFTyxNQUFNO1FBQ1YsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUE7O1lBRWIsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzs7WUFDMUIsZUFBZSxHQUFHLENBQUM7O1lBQ25CLENBQUMsR0FBRyxDQUFDO1FBRVQsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2pDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUMvRSxDQUFDLEVBQUUsQ0FBQTthQUNOO1lBQ0QsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtnQkFDcEIsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFBO2FBQ2hCO1lBQ0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQTtZQUV6QyxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFBO1NBQ2pDO1FBRUQsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFBO0lBQ3ZCLENBQUM7Ozs7Ozs7SUFFTyxrQkFBa0IsQ0FBQyxNQUFrQixFQUFFLFNBQWM7O2NBQ25ELGFBQWEsR0FBRyxJQUFJLENBQUMsZUFBZSxFQUFFLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUM7UUFDekUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQTs7Y0FDaEIsYUFBYSxHQUFHLElBQUksQ0FBQyxlQUFlLEVBQUUsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQztRQUV6RSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQTtJQUM1RCxDQUFDOzs7Ozs7SUFFTyxhQUFhLENBQUMsTUFBa0I7O2NBQzlCLGdCQUFnQixHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUM7O2NBRXBELEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLEdBQUcsZ0JBQWdCOztjQUNsRyxTQUFTLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEtBQUs7UUFFMUUsT0FBTyxTQUFTLENBQUE7SUFDcEIsQ0FBQzs7Ozs7O0lBRU8sb0JBQW9CLENBQUMsTUFBa0I7O1lBQ3ZDLGdCQUFnQixHQUFHLENBQUM7UUFDeEIsTUFBTSxDQUFDLE9BQU87Ozs7UUFBQyxHQUFHLENBQUMsRUFBRTs7a0JBQ1gsZUFBZSxHQUFHLElBQUksQ0FBQyxlQUFlLEVBQUUsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUMsUUFBUSxDQUFDO1lBQzNGLEdBQUcsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsZUFBZSxDQUFBO1lBQ3ZHLEdBQUcsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUE7WUFDbkUsZ0JBQWdCLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQ2pFLENBQUMsRUFBQyxDQUFBO1FBRUYsT0FBTyxnQkFBZ0IsQ0FBQTtJQUMzQixDQUFDOzs7OztJQUVPLGVBQWU7UUFDbkIsT0FBTyxJQUFJLENBQUMsZUFBZSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsR0FBRyxDQUFBO0lBQ3ZFLENBQUM7Ozs7O0lBRU8sZUFBZTtRQUNuQixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsV0FBVyxLQUFLLENBQUMsRUFBRTtZQUN2RCxXQUFXO1lBQ1gsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQTtTQUN6RDtRQUNELE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUE7SUFDMUQsQ0FBQzs7Ozs7SUFFTyxZQUFZOztZQUNaLFlBQVksR0FBRyxDQUFDOztZQUNoQix5QkFBeUIsR0FBRyxDQUFDO1FBRWpDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO2FBQ2hFLE9BQU87Ozs7UUFBQyxNQUFNLENBQUMsRUFBRTs7a0JBQ1YsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQztZQUUxRCxJQUFJLE1BQU0sS0FBSyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUFFOztzQkFDNUMsS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsR0FBRyxnQkFBZ0I7Z0JBRXhHLE1BQU0sQ0FBQyxPQUFPOzs7O2dCQUFDLENBQUMsR0FBUSxFQUFFLEVBQUU7b0JBQ3hCLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsS0FBSyxDQUFBO29CQUNoRSxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEtBQUssQ0FBQTtvQkFDbEUseUJBQXlCLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQTtvQkFDOUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFBO2dCQUNsRCxDQUFDLEVBQUMsQ0FBQTthQUNMO2lCQUFNO2dCQUNILE1BQU0sQ0FBQyxPQUFPOzs7O2dCQUFDLENBQUMsR0FBUSxFQUFFLEVBQUU7b0JBQ3hCLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFBO29CQUNyRCxHQUFHLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQTtvQkFDdkQseUJBQXlCLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQTtvQkFDOUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFBO2dCQUNsRCxDQUFDLEVBQUMsQ0FBQTthQUNMO1FBQ0wsQ0FBQyxFQUFDLENBQUE7UUFFRixJQUFJLENBQUMsc0JBQXNCLEdBQUcseUJBQXlCLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQTtRQUM1RixJQUFJLENBQUMsMkJBQTJCLEVBQUUsQ0FBQTtRQUVsQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsYUFBYSxFQUFFLENBQUE7SUFDMUMsQ0FBQzs7Ozs7OztJQUVPLG9CQUFvQixDQUFDLEtBQVUsRUFBRSxZQUFvQjs7Y0FDbkQsYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFO1FBRWxELElBQUksS0FBSyxDQUFDLG9CQUFvQixDQUFDO1lBQzNCLENBQUMsYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDO2dCQUN2QixhQUFhLENBQUMsWUFBWSxDQUFDO2dCQUMzQixJQUFJLENBQUMsa0JBQWtCLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLEVBQUU7WUFDdkUsS0FBSyxDQUFDLG9CQUFvQixDQUFDLEdBQUcsSUFBSSxDQUFBO1lBQ2xDLEtBQUssQ0FBQyxlQUFlLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUMsTUFBTSxDQUFDLENBQUE7U0FDdEU7YUFBTTtZQUNILEtBQUssQ0FBQyxlQUFlLENBQUMsR0FBRyxFQUFFLENBQUE7U0FDOUI7SUFDTCxDQUFDOzs7Ozs7SUFFTyxrQkFBa0IsQ0FBQyxPQUFZOztjQUM3QixVQUFVLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixFQUFFLENBQUMsR0FBRzs7Y0FDaEQsYUFBYSxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLE1BQU07UUFFNUQsT0FBTyxVQUFVLEdBQUcsTUFBTSxDQUFDLFdBQVcsSUFBSSxhQUFhLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUE7SUFDekcsQ0FBQzs7Ozs7SUFFTywyQkFBMkI7UUFDL0IsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxDQUFBO1FBQzNDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFBO0lBQ3RGLENBQUM7OztZQS9PSixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLFNBQVM7Z0JBQ25CLDY2RUFBdUM7O2FBRTFDOzs7O1lBUlEsWUFBWTtZQUVaLFVBQVU7WUFMakIsaUJBQWlCOzs7a0NBd0JkLEtBQUssU0FBQyxnQkFBZ0I7Z0NBQ3RCLEtBQUssU0FBQyxlQUFlO2tDQUNyQixLQUFLLFNBQUMsYUFBYTtrQ0FDbkIsS0FBSyxTQUFDLGFBQWE7MEJBQ25CLEtBQUssU0FBQyxnQkFBZ0I7MkJBRXRCLE1BQU07K0JBRU4sU0FBUyxTQUFDLGtCQUFrQixFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTs0QkFDOUMsWUFBWSxTQUFDLGNBQWM7MkJBRTNCLFlBQVksU0FBQyxlQUFlLEVBQUUsQ0FBQyxRQUFRLENBQUM7MkJBSXhDLFlBQVksU0FBQyxlQUFlLEVBQUUsQ0FBQyxRQUFRLENBQUM7Ozs7SUExQnpDLG1DQUF3Qjs7SUFDeEIsK0NBQW1EOztJQUNuRCxpREFBa0M7O0lBQ2xDLHdDQUFrQzs7SUFDbEMsa0NBQXVCOztJQUN2QixrREFBc0M7O0lBQ3RDLDhDQUFnQzs7SUFDaEMsb0NBQW9COztJQUNwQiw4Q0FBbUM7O0lBQ25DLDZDQUFrQzs7SUFFbEMsK0NBQXdEOztJQUN4RCw2Q0FBcUQ7O0lBQ3JELCtDQUFzRDs7SUFDdEQsK0NBQTZEOztJQUM3RCx1Q0FBa0Q7O0lBRWxELHdDQUFvRDs7SUFFcEQsNENBQTZFOztJQUM3RSx5Q0FBMkQ7O0lBVS9DLHdDQUFpQzs7SUFBRSxnQ0FBdUI7O0lBQUUsNkNBQTJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsIENvbXBvbmVudCwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBIb3N0TGlzdGVuZXIsXG4gIElucHV0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgT25Jbml0LCBPdXRwdXQsIFF1ZXJ5TGlzdCwgU2ltcGxlQ2hhbmdlcywgVmlld0NoaWxkLCBWaWV3Q2hpbGRyZW5cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSdcbmltcG9ydCB7IEltYWdlU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL2ltYWdlLnNlcnZpY2UnXG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzL2ludGVybmFsL1N1YnNjcmlwdGlvbidcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCdcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdnYWxsZXJ5JyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vZ2FsbGVyeS5jb21wb25lbnQuaHRtbCcsXG4gICAgc3R5bGVVcmxzOiBbJy4vZ2FsbGVyeS5jb21wb25lbnQuY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgR2FsbGVyeUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBPbkNoYW5nZXMge1xuICAgIGdhbGxlcnk6IEFycmF5PGFueT4gPSBbXVxuICAgIGltYWdlRGF0YVN0YXRpY1BhdGg6IHN0cmluZyA9ICdhc3NldHMvaW1nL2dhbGxlcnkvJ1xuICAgIGltYWdlRGF0YUNvbXBsZXRlUGF0aDogc3RyaW5nID0gJydcbiAgICBkYXRhRmlsZU5hbWU6IHN0cmluZyA9ICdkYXRhLmpzb24nXG4gICAgaW1hZ2VzOiBBcnJheTxhbnk+ID0gW11cbiAgICBtaW5pbWFsUXVhbGl0eUNhdGVnb3J5ID0gJ3ByZXZpZXdfeHhzJ1xuICAgIHZpZXdlclN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uXG4gICAgcm93SW5kZXg6IG51bWJlciA9IDBcbiAgICByaWdodEFycm93SW5hY3RpdmU6IGJvb2xlYW4gPSBmYWxzZVxuICAgIGxlZnRBcnJvd0luYWN0aXZlOiBib29sZWFuID0gZmFsc2VcblxuICAgIEBJbnB1dCgnZmxleEJvcmRlclNpemUnKSBwcm92aWRlZEltYWdlTWFyZ2luOiBudW1iZXIgPSAzXG4gICAgQElucHV0KCdmbGV4SW1hZ2VTaXplJykgcHJvdmlkZWRJbWFnZVNpemU6IG51bWJlciA9IDdcbiAgICBASW5wdXQoJ2dhbGxlcnlOYW1lJykgcHJvdmlkZWRHYWxsZXJ5TmFtZTogc3RyaW5nID0gJydcbiAgICBASW5wdXQoJ21ldGFkYXRhVXJpJykgcHJvdmlkZWRNZXRhZGF0YVVyaTogc3RyaW5nID0gdW5kZWZpbmVkXG4gICAgQElucHV0KCdtYXhSb3dzUGVyUGFnZScpIHJvd3NQZXJQYWdlOiBudW1iZXIgPSAyMDBcblxuICAgIEBPdXRwdXQoKSB2aWV3ZXJDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KClcblxuICAgIEBWaWV3Q2hpbGQoJ2dhbGxlcnlDb250YWluZXInLCB7IHN0YXRpYzogdHJ1ZSB9KSBnYWxsZXJ5Q29udGFpbmVyOiBFbGVtZW50UmVmXG4gICAgQFZpZXdDaGlsZHJlbignaW1hZ2VFbGVtZW50JykgaW1hZ2VFbGVtZW50czogUXVlcnlMaXN0PGFueT5cblxuICAgIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzpzY3JvbGwnLCBbJyRldmVudCddKSB0cmlnZ2VyQ3ljbGUoZXZlbnQ6IGFueSk6IHZvaWQge1xuICAgICAgICB0aGlzLnNjYWxlR2FsbGVyeSgpXG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcignd2luZG93OnJlc2l6ZScsIFsnJGV2ZW50J10pIHdpbmRvd1Jlc2l6ZShldmVudDogYW55KTogdm9pZCB7XG4gICAgICAgIHRoaXMucmVuZGVyKClcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgaW1hZ2VTZXJ2aWNlOiBJbWFnZVNlcnZpY2UsIHB1YmxpYyBodHRwOiBIdHRwQ2xpZW50LCBwdWJsaWMgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmKSB7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZmV0Y2hEYXRhQW5kUmVuZGVyKClcbiAgICAgICAgdGhpcy52aWV3ZXJTdWJzY3JpcHRpb24gPSB0aGlzLmltYWdlU2VydmljZS5zaG93SW1hZ2VWaWV3ZXJDaGFuZ2VkJFxuICAgICAgICAgICAgLnN1YnNjcmliZSgodmlzaWJpbGl0eTogYm9vbGVhbikgPT4gdGhpcy52aWV3ZXJDaGFuZ2UuZW1pdCh2aXNpYmlsaXR5KSlcbiAgICB9XG5cbiAgICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgICAgIC8vIGlucHV0IHBhcmFtcyBjaGFuZ2VkXG4gICAgICAgIGlmIChjaGFuZ2VzWydwcm92aWRlZEdhbGxlcnlOYW1lJ10gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmZldGNoRGF0YUFuZFJlbmRlcigpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlbmRlcigpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMudmlld2VyU3Vic2NyaXB0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnZpZXdlclN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvcGVuSW1hZ2VWaWV3ZXIoaW1nOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5pbWFnZVNlcnZpY2UudXBkYXRlSW1hZ2VzKHRoaXMuaW1hZ2VzKVxuICAgICAgICB0aGlzLmltYWdlU2VydmljZS51cGRhdGVTZWxlY3RlZEltYWdlSW5kZXgodGhpcy5pbWFnZXMuaW5kZXhPZihpbWcpKVxuICAgICAgICB0aGlzLmltYWdlU2VydmljZS5zaG93SW1hZ2VWaWV3ZXIodHJ1ZSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBkaXJlY3Rpb24gKC0xOiBsZWZ0LCAxOiByaWdodClcbiAgICAgKi9cbiAgICBuYXZpZ2F0ZShkaXJlY3Rpb246IG51bWJlcik6IHZvaWQge1xuICAgICAgICBpZiAoKGRpcmVjdGlvbiA9PT0gMSAmJiB0aGlzLnJvd0luZGV4IDwgdGhpcy5nYWxsZXJ5Lmxlbmd0aCAtIHRoaXMucm93c1BlclBhZ2UpXG4gICAgICAgICAgICB8fCAoZGlyZWN0aW9uID09PSAtMSAmJiB0aGlzLnJvd0luZGV4ID4gMCkpIHtcbiAgICAgICAgICAgIHRoaXMucm93SW5kZXggKz0gKHRoaXMucm93c1BlclBhZ2UgKiBkaXJlY3Rpb24pXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZWZyZXNoTmF2aWdhdGlvbkVycm9yU3RhdGUoKVxuICAgIH1cblxuICAgIGNhbGNJbWFnZU1hcmdpbigpOiBudW1iZXIge1xuICAgICAgICBjb25zdCBnYWxsZXJ5V2lkdGggPSB0aGlzLmdldEdhbGxlcnlXaWR0aCgpXG4gICAgICAgIGNvbnN0IHJhdGlvID0gZ2FsbGVyeVdpZHRoIC8gMTkyMFxuICAgICAgICByZXR1cm4gTWF0aC5yb3VuZChNYXRoLm1heCgxLCB0aGlzLnByb3ZpZGVkSW1hZ2VNYXJnaW4gKiByYXRpbykpXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmZXRjaERhdGFBbmRSZW5kZXIoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuaW1hZ2VEYXRhQ29tcGxldGVQYXRoID0gdGhpcy5wcm92aWRlZE1ldGFkYXRhVXJpXG5cbiAgICAgICAgaWYgKCF0aGlzLnByb3ZpZGVkTWV0YWRhdGFVcmkpIHtcbiAgICAgICAgICAgIHRoaXMuaW1hZ2VEYXRhQ29tcGxldGVQYXRoID0gdGhpcy5wcm92aWRlZEdhbGxlcnlOYW1lICE9PSAnJyA/XG4gICAgICAgICAgICAgICAgYCR7dGhpcy5pbWFnZURhdGFTdGF0aWNQYXRoICsgdGhpcy5wcm92aWRlZEdhbGxlcnlOYW1lfS8ke3RoaXMuZGF0YUZpbGVOYW1lfWAgOlxuICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2VEYXRhU3RhdGljUGF0aCArIHRoaXMuZGF0YUZpbGVOYW1lXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmh0dHAuZ2V0KHRoaXMuaW1hZ2VEYXRhQ29tcGxldGVQYXRoKVxuICAgICAgICAgIC5zdWJzY3JpYmUoXG4gICAgICAgICAgICAoZGF0YTogQXJyYXk8YW55PikgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmltYWdlcyA9IGRhdGFcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbWFnZVNlcnZpY2UudXBkYXRlSW1hZ2VzKHRoaXMuaW1hZ2VzKVxuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2VzLmZvckVhY2goaW1hZ2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIGltYWdlWydnYWxsZXJ5SW1hZ2VMb2FkZWQnXSA9IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgaW1hZ2VbJ3ZpZXdlckltYWdlTG9hZGVkJ10gPSBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgIGltYWdlWydzcmNBZnRlckZvY3VzJ10gPSAnJ1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAvLyB0d2ljZSwgc2luZ2xlIGxlYWRzIHRvIGRpZmZlcmVudCBzdHJhbmdlIGJyb3dzZXIgYmVoYXZpb3VyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyKClcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXIoKVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGVyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnByb3ZpZGVkTWV0YWRhdGFVcmkpIHtcbiAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBQcm92aWRlZCBlbmRwb2ludCAnJHt0aGlzLnByb3ZpZGVkTWV0YWRhdGFVcml9JyBkaWQgbm90IHNlcnZlIG1ldGFkYXRhIGNvcnJlY3RseSBvciBpbiB0aGUgZXhwZWN0ZWQgZm9ybWF0LlxuICAgICAgU2VlIGhlcmUgZm9yIG1vcmUgaW5mb3JtYXRpb246IGh0dHBzOi8vZ2l0aHViLmNvbS9CZW5qYW1pbkJyYW5kbWVpZXIvYW5ndWxhcjItaW1hZ2UtZ2FsbGVyeS9ibG9iL21hc3Rlci9kb2NzL2V4dGVybmFsRGF0YVNvdXJjZS5tZCxcbiAgICAgIE9yaWdpbmFsIGVycm9yOiAke2Vycn1gKVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgRGlkIHlvdSBydW4gdGhlIGNvbnZlcnQgc2NyaXB0IGZyb20gYW5ndWxhcjItaW1hZ2UtZ2FsbGVyeSBmb3IgeW91ciBpbWFnZXMgZmlyc3Q/IE9yaWdpbmFsIGVycm9yOiAke2Vycn1gKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAoKSA9PiB1bmRlZmluZWQpXG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZW5kZXIoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZ2FsbGVyeSA9IFtdXG5cbiAgICAgICAgbGV0IHRlbXBSb3cgPSBbdGhpcy5pbWFnZXNbMF1dXG4gICAgICAgIGxldCBjdXJyZW50Um93SW5kZXggPSAwXG4gICAgICAgIGxldCBpID0gMFxuXG4gICAgICAgIGZvciAoaTsgaSA8IHRoaXMuaW1hZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB3aGlsZSAodGhpcy5pbWFnZXNbaSArIDFdICYmIHRoaXMuc2hvdWxkQWRkQ2FuZGlkYXRlKHRlbXBSb3csIHRoaXMuaW1hZ2VzW2kgKyAxXSkpIHtcbiAgICAgICAgICAgICAgICBpKytcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmltYWdlc1tpICsgMV0pIHtcbiAgICAgICAgICAgICAgICB0ZW1wUm93LnBvcCgpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmdhbGxlcnlbY3VycmVudFJvd0luZGV4KytdID0gdGVtcFJvd1xuXG4gICAgICAgICAgICB0ZW1wUm93ID0gW3RoaXMuaW1hZ2VzW2kgKyAxXV1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2NhbGVHYWxsZXJ5KClcbiAgICB9XG5cbiAgICBwcml2YXRlIHNob3VsZEFkZENhbmRpZGF0ZShpbWdSb3c6IEFycmF5PGFueT4sIGNhbmRpZGF0ZTogYW55KTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IG9sZERpZmZlcmVuY2UgPSB0aGlzLmNhbGNJZGVhbEhlaWdodCgpIC0gdGhpcy5jYWxjUm93SGVpZ2h0KGltZ1JvdylcbiAgICAgICAgaW1nUm93LnB1c2goY2FuZGlkYXRlKVxuICAgICAgICBjb25zdCBuZXdEaWZmZXJlbmNlID0gdGhpcy5jYWxjSWRlYWxIZWlnaHQoKSAtIHRoaXMuY2FsY1Jvd0hlaWdodChpbWdSb3cpXG5cbiAgICAgICAgcmV0dXJuIE1hdGguYWJzKG9sZERpZmZlcmVuY2UpID4gTWF0aC5hYnMobmV3RGlmZmVyZW5jZSlcbiAgICB9XG5cbiAgICBwcml2YXRlIGNhbGNSb3dIZWlnaHQoaW1nUm93OiBBcnJheTxhbnk+KTogbnVtYmVyIHtcbiAgICAgICAgY29uc3Qgb3JpZ2luYWxSb3dXaWR0aCA9IHRoaXMuY2FsY09yaWdpbmFsUm93V2lkdGgoaW1nUm93KVxuXG4gICAgICAgIGNvbnN0IHJhdGlvID0gKHRoaXMuZ2V0R2FsbGVyeVdpZHRoKCkgLSAoaW1nUm93Lmxlbmd0aCAtIDEpICogdGhpcy5jYWxjSW1hZ2VNYXJnaW4oKSkgLyBvcmlnaW5hbFJvd1dpZHRoXG4gICAgICAgIGNvbnN0IHJvd0hlaWdodCA9IGltZ1Jvd1swXVt0aGlzLm1pbmltYWxRdWFsaXR5Q2F0ZWdvcnldWydoZWlnaHQnXSAqIHJhdGlvXG5cbiAgICAgICAgcmV0dXJuIHJvd0hlaWdodFxuICAgIH1cblxuICAgIHByaXZhdGUgY2FsY09yaWdpbmFsUm93V2lkdGgoaW1nUm93OiBBcnJheTxhbnk+KTogbnVtYmVyIHtcbiAgICAgICAgbGV0IG9yaWdpbmFsUm93V2lkdGggPSAwXG4gICAgICAgIGltZ1Jvdy5mb3JFYWNoKGltZyA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbmRpdmlkdWFsUmF0aW8gPSB0aGlzLmNhbGNJZGVhbEhlaWdodCgpIC8gaW1nW3RoaXMubWluaW1hbFF1YWxpdHlDYXRlZ29yeV1bJ2hlaWdodCddXG4gICAgICAgICAgICBpbWdbdGhpcy5taW5pbWFsUXVhbGl0eUNhdGVnb3J5XVsnd2lkdGgnXSA9IGltZ1t0aGlzLm1pbmltYWxRdWFsaXR5Q2F0ZWdvcnldWyd3aWR0aCddICogaW5kaXZpZHVhbFJhdGlvXG4gICAgICAgICAgICBpbWdbdGhpcy5taW5pbWFsUXVhbGl0eUNhdGVnb3J5XVsnaGVpZ2h0J10gPSB0aGlzLmNhbGNJZGVhbEhlaWdodCgpXG4gICAgICAgICAgICBvcmlnaW5hbFJvd1dpZHRoICs9IGltZ1t0aGlzLm1pbmltYWxRdWFsaXR5Q2F0ZWdvcnldWyd3aWR0aCddXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIG9yaWdpbmFsUm93V2lkdGhcbiAgICB9XG5cbiAgICBwcml2YXRlIGNhbGNJZGVhbEhlaWdodCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRHYWxsZXJ5V2lkdGgoKSAvICg4MCAvIHRoaXMucHJvdmlkZWRJbWFnZVNpemUpICsgMTAwXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRHYWxsZXJ5V2lkdGgoKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHRoaXMuZ2FsbGVyeUNvbnRhaW5lci5uYXRpdmVFbGVtZW50LmNsaWVudFdpZHRoID09PSAwKSB7XG4gICAgICAgICAgICAvLyBmb3IgSUUxMVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2FsbGVyeUNvbnRhaW5lci5uYXRpdmVFbGVtZW50LnNjcm9sbFdpZHRoXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZ2FsbGVyeUNvbnRhaW5lci5uYXRpdmVFbGVtZW50LmNsaWVudFdpZHRoXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzY2FsZUdhbGxlcnkoKTogdm9pZCB7XG4gICAgICAgIGxldCBpbWFnZUNvdW50ZXIgPSAwXG4gICAgICAgIGxldCBtYXhpbXVtR2FsbGVyeUltYWdlSGVpZ2h0ID0gMFxuXG4gICAgICAgIHRoaXMuZ2FsbGVyeS5zbGljZSh0aGlzLnJvd0luZGV4LCB0aGlzLnJvd0luZGV4ICsgdGhpcy5yb3dzUGVyUGFnZSlcbiAgICAgICAgICAuZm9yRWFjaChpbWdSb3cgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxSb3dXaWR0aCA9IHRoaXMuY2FsY09yaWdpbmFsUm93V2lkdGgoaW1nUm93KVxuXG4gICAgICAgICAgICBpZiAoaW1nUm93ICE9PSB0aGlzLmdhbGxlcnlbdGhpcy5nYWxsZXJ5Lmxlbmd0aCAtIDFdKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmF0aW8gPSAodGhpcy5nZXRHYWxsZXJ5V2lkdGgoKSAtIChpbWdSb3cubGVuZ3RoIC0gMSkgKiB0aGlzLmNhbGNJbWFnZU1hcmdpbigpKSAvIG9yaWdpbmFsUm93V2lkdGhcblxuICAgICAgICAgICAgICAgIGltZ1Jvdy5mb3JFYWNoKChpbWc6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpbWdbJ3dpZHRoJ10gPSBpbWdbdGhpcy5taW5pbWFsUXVhbGl0eUNhdGVnb3J5XVsnd2lkdGgnXSAqIHJhdGlvXG4gICAgICAgICAgICAgICAgICAgIGltZ1snaGVpZ2h0J10gPSBpbWdbdGhpcy5taW5pbWFsUXVhbGl0eUNhdGVnb3J5XVsnaGVpZ2h0J10gKiByYXRpb1xuICAgICAgICAgICAgICAgICAgICBtYXhpbXVtR2FsbGVyeUltYWdlSGVpZ2h0ID0gTWF0aC5tYXgobWF4aW11bUdhbGxlcnlJbWFnZUhlaWdodCwgaW1nWydoZWlnaHQnXSlcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGVja0ZvckFzeW5jTG9hZGluZyhpbWcsIGltYWdlQ291bnRlcisrKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGltZ1Jvdy5mb3JFYWNoKChpbWc6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpbWcud2lkdGggPSBpbWdbdGhpcy5taW5pbWFsUXVhbGl0eUNhdGVnb3J5XVsnd2lkdGgnXVxuICAgICAgICAgICAgICAgICAgICBpbWcuaGVpZ2h0ID0gaW1nW3RoaXMubWluaW1hbFF1YWxpdHlDYXRlZ29yeV1bJ2hlaWdodCddXG4gICAgICAgICAgICAgICAgICAgIG1heGltdW1HYWxsZXJ5SW1hZ2VIZWlnaHQgPSBNYXRoLm1heChtYXhpbXVtR2FsbGVyeUltYWdlSGVpZ2h0LCBpbWdbJ2hlaWdodCddKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZWNrRm9yQXN5bmNMb2FkaW5nKGltZywgaW1hZ2VDb3VudGVyKyspXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICB0aGlzLm1pbmltYWxRdWFsaXR5Q2F0ZWdvcnkgPSBtYXhpbXVtR2FsbGVyeUltYWdlSGVpZ2h0ID4gMzc1ID8gJ3ByZXZpZXdfeHMnIDogJ3ByZXZpZXdfeHhzJ1xuICAgICAgICB0aGlzLnJlZnJlc2hOYXZpZ2F0aW9uRXJyb3JTdGF0ZSgpXG5cbiAgICAgICAgdGhpcy5jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKClcbiAgICB9XG5cbiAgICBwcml2YXRlIGNoZWNrRm9yQXN5bmNMb2FkaW5nKGltYWdlOiBhbnksIGltYWdlQ291bnRlcjogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGltYWdlRWxlbWVudHMgPSB0aGlzLmltYWdlRWxlbWVudHMudG9BcnJheSgpXG5cbiAgICAgICAgaWYgKGltYWdlWydnYWxsZXJ5SW1hZ2VMb2FkZWQnXSB8fFxuICAgICAgICAgICAgKGltYWdlRWxlbWVudHMubGVuZ3RoID4gMCAmJlxuICAgICAgICAgICAgICBpbWFnZUVsZW1lbnRzW2ltYWdlQ291bnRlcl0gJiZcbiAgICAgICAgICAgICAgdGhpcy5pc1Njcm9sbGVkSW50b1ZpZXcoaW1hZ2VFbGVtZW50c1tpbWFnZUNvdW50ZXJdLm5hdGl2ZUVsZW1lbnQpKSkge1xuICAgICAgICAgICAgaW1hZ2VbJ2dhbGxlcnlJbWFnZUxvYWRlZCddID0gdHJ1ZVxuICAgICAgICAgICAgaW1hZ2VbJ3NyY0FmdGVyRm9jdXMnXSA9IGltYWdlW3RoaXMubWluaW1hbFF1YWxpdHlDYXRlZ29yeV1bJ3BhdGgnXVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW1hZ2VbJ3NyY0FmdGVyRm9jdXMnXSA9ICcnXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGlzU2Nyb2xsZWRJbnRvVmlldyhlbGVtZW50OiBhbnkpOiBib29sZWFuIHtcbiAgICAgICAgY29uc3QgZWxlbWVudFRvcCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wXG4gICAgICAgIGNvbnN0IGVsZW1lbnRCb3R0b20gPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmJvdHRvbVxuXG4gICAgICAgIHJldHVybiBlbGVtZW50VG9wIDwgd2luZG93LmlubmVySGVpZ2h0ICYmIGVsZW1lbnRCb3R0b20gPj0gMCAmJiAoZWxlbWVudEJvdHRvbSA+IDAgfHwgZWxlbWVudFRvcCA+IDApXG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZWZyZXNoTmF2aWdhdGlvbkVycm9yU3RhdGUoKTogdm9pZCB7XG4gICAgICAgIHRoaXMubGVmdEFycm93SW5hY3RpdmUgPSB0aGlzLnJvd0luZGV4ID09IDBcbiAgICAgICAgdGhpcy5yaWdodEFycm93SW5hY3RpdmUgPSB0aGlzLnJvd0luZGV4ID4gKHRoaXMuZ2FsbGVyeS5sZW5ndGggLSB0aGlzLnJvd3NQZXJQYWdlKVxuICAgIH1cbn1cbiJdfQ==