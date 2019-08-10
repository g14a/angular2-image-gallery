import { Injectable, EventEmitter, Component, ChangeDetectorRef, Input, Output, ViewChild, ViewChildren, HostListener, NgModule } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class ImageService {
    constructor() {
        this.imagesUpdatedSource = new Subject();
        this.imageSelectedIndexUpdatedSource = new Subject();
        this.showImageViewerSource = new Subject();
        this.imagesUpdated$ = this.imagesUpdatedSource.asObservable();
        this.imageSelectedIndexUpdated$ = this.imageSelectedIndexUpdatedSource.asObservable();
        this.showImageViewerChanged$ = this.showImageViewerSource.asObservable();
    }
    /**
     * @param {?} images
     * @return {?}
     */
    updateImages(images) {
        this.imagesUpdatedSource.next(images);
    }
    /**
     * @param {?} newIndex
     * @return {?}
     */
    updateSelectedImageIndex(newIndex) {
        this.imageSelectedIndexUpdatedSource.next(newIndex);
    }
    /**
     * @param {?} show
     * @return {?}
     */
    showImageViewer(show) {
        this.showImageViewerSource.next(show);
    }
}
ImageService.decorators = [
    { type: Injectable }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class GalleryComponent {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class ViewerComponent {
    /**
     * @param {?} imageService
     */
    constructor(imageService) {
        this.imageService = imageService;
        this.images = [{}];
        this.currentIdx = 0;
        this.leftArrowVisible = true;
        this.rightArrowVisible = true;
        this.categorySelected = 'preview_xxs';
        this.qualitySelectorShown = false;
        this.qualitySelected = 'auto';
        imageService.imagesUpdated$.subscribe((/**
         * @param {?} images
         * @return {?}
         */
        images => {
            this.images = images;
        }));
        imageService.imageSelectedIndexUpdated$.subscribe((/**
         * @param {?} newIndex
         * @return {?}
         */
        newIndex => {
            this.currentIdx = newIndex;
            this.images.forEach((/**
             * @param {?} image
             * @return {?}
             */
            image => image['active'] = false));
            this.images[this.currentIdx]['active'] = true;
            this.transform = 0;
            this.updateQuality();
        }));
        imageService.showImageViewerChanged$.subscribe((/**
         * @param {?} showViewer
         * @return {?}
         */
        showViewer => {
            this.showViewer = showViewer;
        }));
        this.math = Math;
    }
    /**
     * @return {?}
     */
    get leftArrowActive() {
        return this.currentIdx > 0;
    }
    /**
     * @return {?}
     */
    get rightArrowActive() {
        return this.currentIdx < this.images.length - 1;
    }
    /**
     * @param {?} swipe
     * @return {?}
     */
    pan(swipe) {
        this.transform = swipe.deltaX;
    }
    /**
     * @return {?}
     */
    onResize() {
        this.images.forEach((/**
         * @param {?} image
         * @return {?}
         */
        image => {
            image['viewerImageLoaded'] = false;
            image['active'] = false;
        }));
        this.updateImage();
    }
    /**
     * @return {?}
     */
    showQualitySelector() {
        this.qualitySelectorShown = !this.qualitySelectorShown;
    }
    /**
     * @param {?} newQuality
     * @return {?}
     */
    qualityChanged(newQuality) {
        this.qualitySelected = newQuality;
        this.updateImage();
    }
    /**
     * @param {?} image
     * @return {?}
     */
    imageLoaded(image) {
        image['viewerImageLoaded'] = true;
    }
    /**
     * direction (-1: left, 1: right)
     * swipe (user swiped)
     * @param {?} direction
     * @param {?} swipe
     * @return {?}
     */
    navigate(direction, swipe) {
        if ((direction === 1 && this.currentIdx < this.images.length - 1) ||
            (direction === -1 && this.currentIdx > 0)) {
            if (direction == -1) {
                this.images[this.currentIdx]['transition'] = 'leaveToRight';
                this.images[this.currentIdx - 1]['transition'] = 'enterFromLeft';
            }
            else {
                this.images[this.currentIdx]['transition'] = 'leaveToLeft';
                this.images[this.currentIdx + 1]['transition'] = 'enterFromRight';
            }
            this.currentIdx += direction;
            if (swipe) {
                this.hideNavigationArrows();
            }
            else {
                this.showNavigationArrows();
            }
            this.updateImage();
        }
    }
    /**
     * @return {?}
     */
    showNavigationArrows() {
        this.leftArrowVisible = true;
        this.rightArrowVisible = true;
    }
    /**
     * @return {?}
     */
    closeViewer() {
        this.images.forEach((/**
         * @param {?} image
         * @return {?}
         */
        image => image['transition'] = undefined));
        this.images.forEach((/**
         * @param {?} image
         * @return {?}
         */
        image => image['active'] = false));
        this.imageService.showImageViewer(false);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onKeydown(event) {
        /** @type {?} */
        const prevent = [37, 39, 27, 36, 35]
            .find((/**
         * @param {?} no
         * @return {?}
         */
        no => no === event.keyCode));
        if (prevent) {
            event.preventDefault();
        }
        switch (prevent) {
            case 37:
                // navigate left
                this.navigate(-1, false);
                break;
            case 39:
                // navigate right
                this.navigate(1, false);
                break;
            case 27:
                // esc
                this.closeViewer();
                break;
            case 36:
                // pos 1
                this.images[this.currentIdx]['transition'] = 'leaveToRight';
                this.currentIdx = 0;
                this.images[this.currentIdx]['transition'] = 'enterFromLeft';
                this.updateImage();
                break;
            case 35:
                // end
                this.images[this.currentIdx]['transition'] = 'leaveToLeft';
                this.currentIdx = this.images.length - 1;
                this.images[this.currentIdx]['transition'] = 'enterFromRight';
                this.updateImage();
                break;
            default:
                break;
        }
    }
    /**
     * @private
     * @return {?}
     */
    hideNavigationArrows() {
        this.leftArrowVisible = false;
        this.rightArrowVisible = false;
    }
    /**
     * @private
     * @return {?}
     */
    updateImage() {
        // wait for animation to end
        setTimeout((/**
         * @return {?}
         */
        () => {
            this.updateQuality();
            this.images[this.currentIdx]['active'] = true;
            this.images.forEach((/**
             * @param {?} image
             * @return {?}
             */
            image => {
                if (image != this.images[this.currentIdx]) {
                    image['active'] = false;
                    this.transform = 0;
                }
            }));
        }), 100);
    }
    /**
     * @private
     * @return {?}
     */
    updateQuality() {
        /** @type {?} */
        const screenWidth = window.innerWidth;
        /** @type {?} */
        const screenHeight = window.innerHeight;
        switch (this.qualitySelected) {
            case 'auto': {
                this.categorySelected = 'preview_xxs';
                if (screenWidth > this.images[this.currentIdx]['preview_xxs'].width &&
                    screenHeight > this.images[this.currentIdx]['preview_xxs'].height) {
                    this.categorySelected = 'preview_xs';
                }
                if (screenWidth > this.images[this.currentIdx]['preview_xs'].width &&
                    screenHeight > this.images[this.currentIdx]['preview_xs'].height) {
                    this.categorySelected = 'preview_s';
                }
                if (screenWidth > this.images[this.currentIdx]['preview_s'].width &&
                    screenHeight > this.images[this.currentIdx]['preview_s'].height) {
                    this.categorySelected = 'raw';
                }
                break;
            }
            case 'low': {
                this.categorySelected = 'preview_xxs';
                break;
            }
            case 'high': {
                this.categorySelected = 'raw';
                break;
            }
            default: {
                this.categorySelected = 'preview_s';
            }
        }
    }
}
ViewerComponent.decorators = [
    { type: Component, args: [{
                selector: 'viewer',
                template: "<div class=\"outerContainer\" (window:resize)=\"onResize()\" *ngIf=\"showViewer\" [@showViewerTransition]=\"showViewer\">\n\n\n    <img [ngClass]=\"{'activeArrow': leftArrowActive}\" class=\"arrow left\"\n         src=\"data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjI0cHgiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjx0aXRsZS8+PGRlc2MvPiAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgaWQ9Im1pdSIgc3Ryb2tlPSIjNTU1IiBzdHJva2Utd2lkdGg9IjAuMiI+ICAgICA8ZyBpZD0iQXJ0Ym9hcmQtMSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTM5NS4wMDAwMDAsIC0xOTEuMDAwMDAwKSI+PGcgaWQ9InNsaWNlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMTUuMDAwMDAwLCAxMTkuMDAwMDAwKSIvPjxwYXRoICAgICAgIGQ9Ik0zOTYsMjAyLjUgQzM5NiwxOTYuMTQ4NzI1IDQwMS4xNDg3MjUsMTkxIDQwNy41LDE5MSBDNDEzLjg1MTI3NSwxOTEgNDE5LDE5Ni4xNDg3MjUgNDE5LDIwMi41IEM0MTksMjA4Ljg1MTI3NSA0MTMuODUxMjc1LDIxNCA0MDcuNSwyMTQgQzQwMS4xNDg3MjUsMjE0IDM5NiwyMDguODUxMjc1IDM5NiwyMDIuNSBaIE00MDguNjU2ODU0LDE5Ni44NDMxNDYgTDQxMC4wNzEwNjgsMTk4LjI1NzM1OSBMNDA1LjgyODQyNywyMDIuNSBMNDEwLjA3MTA2OCwyMDYuNzQyNjQxIEw0MDguNjU2ODU0LDIwOC4xNTY4NTQgTDQwMywyMDIuNSBMNDA4LjY1Njg1NCwxOTYuODQzMTQ2IFoiICAgICAgIGZpbGw9IiNhYWEiICAgICAgIGlkPSJjaXJjbGUtYmFjay1hcnJvdy1nbHlwaCIvPjwvZz4gICA8L2c+IDwvc3ZnPg==\"\n         [hidden]=\"!leftArrowVisible\" (click)=\"navigate(-1, false)\"/>\n    <img [ngClass]=\"{'activeArrow': rightArrowActive}\" class=\"arrow right\"\n         src=\"data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjI0cHgiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjx0aXRsZS8+PGRlc2MvPjxkZWZzLz4gICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGlkPSJtaXUiIHN0cm9rZT0iIzU1NSIgc3Ryb2tlLXdpZHRoPSIwLjIiPiAgICAgPGcgaWQ9IkFydGJvYXJkLTEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC00NjcuMDAwMDAwLCAtMTkxLjAwMDAwMCkiPjxnIGlkPSJzbGljZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjE1LjAwMDAwMCwgMTE5LjAwMDAwMCkiLz48cGF0aCAgICAgICBkPSJNNDY4LDIwMi41IEM0NjgsMTk2LjE0ODcyNSA0NzMuMTQ4NzI1LDE5MSA0NzkuNSwxOTEgQzQ4NS44NTEyNzUsMTkxIDQ5MSwxOTYuMTQ4NzI1IDQ5MSwyMDIuNSBDNDkxLDIwOC44NTEyNzUgNDg1Ljg1MTI3NSwyMTQgNDc5LjUsMjE0IEM0NzMuMTQ4NzI1LDIxNCA0NjgsMjA4Ljg1MTI3NSA0NjgsMjAyLjUgWiBNNDgwLjY1Njg1NCwxOTYuODQzMTQ2IEw0ODIuMDcxMDY4LDE5OC4yNTczNTkgTDQ3Ny44Mjg0MjcsMjAyLjUgTDQ4Mi4wNzEwNjgsMjA2Ljc0MjY0MSBMNDgwLjY1Njg1NCwyMDguMTU2ODU0IEw0NzUsMjAyLjUgTDQ4MC42NTY4NTQsMTk2Ljg0MzE0NiBaIiAgICAgICBmaWxsPSIjYWFhIiAgICAgICBpZD0iY2lyY2xlLW5leHQtYXJyb3ctZGlzY2xvc3VyZS1nbHlwaCIgICAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDc5LjUwMDAwMCwgMjAyLjUwMDAwMCkgc2NhbGUoLTEsIDEpIHRyYW5zbGF0ZSgtNDc5LjUwMDAwMCwgLTIwMi41MDAwMDApICIvPjwvZz4gICA8L2c+IDwvc3ZnPg==\"\n         [hidden]=\"!rightArrowVisible\" (click)=\"navigate(1, false)\"/>\n\n    <div class=\"buttonContainer\">\n        <img class=\"action close\"\n             src=\"data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjMwcHgiIGlkPSJMYXllcl8xIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgdmVyc2lvbj0iMS4xIiBmaWxsPSIjYWFhIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgd2lkdGg9IjI0cHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPiAgPHBhdGggICAgc3Ryb2tlLXdpZHRoPSIzMCIgc3Ryb2tlPSIjNDQ0IiAgICBkPSJNNDM3LjUsMzg2LjZMMzA2LjksMjU2bDEzMC42LTEzMC42YzE0LjEtMTQuMSwxNC4xLTM2LjgsMC01MC45Yy0xNC4xLTE0LjEtMzYuOC0xNC4xLTUwLjksMEwyNTYsMjA1LjFMMTI1LjQsNzQuNSAgYy0xNC4xLTE0LjEtMzYuOC0xNC4xLTUwLjksMGMtMTQuMSwxNC4xLTE0LjEsMzYuOCwwLDUwLjlMMjA1LjEsMjU2TDc0LjUsMzg2LjZjLTE0LjEsMTQuMS0xNC4xLDM2LjgsMCw1MC45ICBjMTQuMSwxNC4xLDM2LjgsMTQuMSw1MC45LDBMMjU2LDMwNi45bDEzMC42LDEzMC42YzE0LjEsMTQuMSwzNi44LDE0LjEsNTAuOSwwQzQ1MS41LDQyMy40LDQ1MS41LDQwMC42LDQzNy41LDM4Ni42eiIvPjwvc3ZnPg==\"\n             (click)=\"closeViewer()\"/>\n    </div>\n\n    <div class=\"imageContainer\"\n         (click)=\"showNavigationArrows()\"\n         (swipeleft)=\"navigate(1, $event)\"\n         (swiperight)=\"navigate(-1, $event)\"\n         (pan)=\"pan($event)\">\n\n        <div *ngFor='let img of images; let j = index'\n             class=\"image\"\n             [class.active]=\"img['active']\"\n             [style.background-image]=\"img['viewerImageLoaded'] ? 'url('+img[categorySelected]['path']+')' : math.abs(currentIdx-j) <=1 ? 'url('+img['preview_xxs']['path']+')' : ''\"\n             [style.left]=\"transform+'px'\"\n             [@imageTransition]=\"img['transition']\"></div>\n\n        <img *ngFor='let img of images; let j = index'\n             class=\"preloading-image\"\n             (load)=\"imageLoaded(img)\"\n             src=\"{{ math.abs(currentIdx-j) <=1 ? img[categorySelected]['path'] : ''}}\"/>\n    </div>\n</div>\n\n",
                host: {
                    '(document:keydown)': 'onKeydown($event)'
                },
                animations: [
                    trigger('imageTransition', [
                        state('enterFromRight', style({
                            opacity: 1,
                            transform: 'translate(0px, 0px)'
                        })),
                        state('enterFromLeft', style({
                            opacity: 1,
                            transform: 'translate(0px, 0px)'
                        })),
                        state('leaveToLeft', style({
                            opacity: 0,
                            transform: 'translate(-100px, 0px)'
                        })),
                        state('leaveToRight', style({
                            opacity: 0,
                            transform: 'translate(100px, 0px)'
                        })),
                        transition('* => enterFromRight', [
                            style({
                                opacity: 0,
                                transform: 'translate(30px, 0px)'
                            }),
                            animate('100ms 250ms ease-in')
                        ]),
                        transition('* => enterFromLeft', [
                            style({
                                opacity: 0,
                                transform: 'translate(-30px, 0px)'
                            }),
                            animate('100ms 250ms ease-in')
                        ]),
                        transition('* => leaveToLeft', [
                            style({
                                opacity: 1
                            }),
                            animate('100ms ease-out')
                        ]),
                        transition('* => leaveToRight', [
                            style({
                                opacity: 1
                            }),
                            animate('100ms ease-out')
                        ])
                    ]),
                    trigger('showViewerTransition', [
                        state('true', style({
                            opacity: 1
                        })),
                        state('void', style({
                            opacity: 0
                        })),
                        transition('void => *', [
                            style({
                                opacity: 0
                            }),
                            animate('1000ms ease-in')
                        ]),
                        transition('* => void', [
                            style({
                                opacity: 1
                            }),
                            animate('250ms ease-out')
                        ])
                    ])
                ],
                styles: [".outerContainer{top:0;bottom:0;left:0;right:0;height:100%;width:100%;position:fixed;background-color:rgba(0,0,0,.95);font-family:sans-serif;z-index:1031}.imageContainer{position:absolute;float:none;top:0;bottom:0;left:0;right:0}.imageContainer .image,.imageContainer .preloading-image{visibility:hidden}.imageContainer .image.active{position:absolute;visibility:visible;background-repeat:no-repeat;background-size:contain;background-position:center;margin:auto;left:0;right:0;top:0;bottom:0;height:100%;width:100%;opacity:1}.arrow{opacity:0}.arrow:hover{cursor:pointer}.outerContainer:hover .arrow.activeArrow{height:calc(20px + 1.5vw);position:absolute;top:calc(50% - (20px + 1.5vw)/ 2);bottom:50%;z-index:1;opacity:1;transition:.5s ease-out}.arrow.left{left:2vw}.arrow.right{right:2vw}.arrow:not(.activeArrow):hover{opacity:0;cursor:pointer;transition:.5s ease-out}.buttonContainer{position:absolute;top:20px;right:20px;height:20px;text-align:center;opacity:1;z-index:200;transition:.5s ease-out}.buttonContainer .action{height:100%;cursor:pointer;vertical-align:top}.buttonContainer .action:focus{outline:0}.buttonContainer .action:hover{background-color:#222;transition:.3s ease-out}.buttonContainer .action.close{width:26px;height:26px}md-button-toggle.checked{background-color:#a0a0a0}.menuButton{position:absolute;bottom:20px;right:20px;text-align:center;opacity:1;z-index:200;transition:.5s ease-out}@font-face{font-family:'Material Icons';font-style:normal;font-weight:400;src:local('Material Icons'),local('MaterialIcons-Regular'),url(https://fonts.gstatic.com/s/materialicons/v19/2fcrYFNaTjcS6g4U3t-Y5ZjZjT5FdEJ140U2DJYC3mY.woff2) format('woff2')}.material-icons{font-family:'Material Icons';font-weight:400;font-style:normal;font-size:24px;line-height:1;letter-spacing:normal;text-transform:none;display:inline-block;white-space:nowrap;word-wrap:normal;direction:ltr;-webkit-font-feature-settings:'liga';-webkit-font-smoothing:antialiased}"]
            }] }
];
/** @nocollapse */
ViewerComponent.ctorParameters = () => [
    { type: ImageService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class Angular2ImageGalleryModule {
}
Angular2ImageGalleryModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    FormsModule,
                    HttpClientModule,
                    BrowserAnimationsModule
                ],
                declarations: [
                    GalleryComponent,
                    ViewerComponent
                ],
                providers: [
                    ImageService
                ],
                exports: [
                    GalleryComponent,
                    ViewerComponent
                ]
            },] }
];

export { Angular2ImageGalleryModule, GalleryComponent, ImageService, ViewerComponent };
//# sourceMappingURL=angular2-image-gallery.js.map
