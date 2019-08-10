/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { ImageService } from '../services/image.service';
import { Component } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
var ViewerComponent = /** @class */ (function () {
    function ViewerComponent(imageService) {
        var _this = this;
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
        function (images) {
            _this.images = images;
        }));
        imageService.imageSelectedIndexUpdated$.subscribe((/**
         * @param {?} newIndex
         * @return {?}
         */
        function (newIndex) {
            _this.currentIdx = newIndex;
            _this.images.forEach((/**
             * @param {?} image
             * @return {?}
             */
            function (image) { return image['active'] = false; }));
            _this.images[_this.currentIdx]['active'] = true;
            _this.transform = 0;
            _this.updateQuality();
        }));
        imageService.showImageViewerChanged$.subscribe((/**
         * @param {?} showViewer
         * @return {?}
         */
        function (showViewer) {
            _this.showViewer = showViewer;
        }));
        this.math = Math;
    }
    Object.defineProperty(ViewerComponent.prototype, "leftArrowActive", {
        get: /**
         * @return {?}
         */
        function () {
            return this.currentIdx > 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewerComponent.prototype, "rightArrowActive", {
        get: /**
         * @return {?}
         */
        function () {
            return this.currentIdx < this.images.length - 1;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} swipe
     * @return {?}
     */
    ViewerComponent.prototype.pan = /**
     * @param {?} swipe
     * @return {?}
     */
    function (swipe) {
        this.transform = swipe.deltaX;
    };
    /**
     * @return {?}
     */
    ViewerComponent.prototype.onResize = /**
     * @return {?}
     */
    function () {
        this.images.forEach((/**
         * @param {?} image
         * @return {?}
         */
        function (image) {
            image['viewerImageLoaded'] = false;
            image['active'] = false;
        }));
        this.updateImage();
    };
    /**
     * @return {?}
     */
    ViewerComponent.prototype.showQualitySelector = /**
     * @return {?}
     */
    function () {
        this.qualitySelectorShown = !this.qualitySelectorShown;
    };
    /**
     * @param {?} newQuality
     * @return {?}
     */
    ViewerComponent.prototype.qualityChanged = /**
     * @param {?} newQuality
     * @return {?}
     */
    function (newQuality) {
        this.qualitySelected = newQuality;
        this.updateImage();
    };
    /**
     * @param {?} image
     * @return {?}
     */
    ViewerComponent.prototype.imageLoaded = /**
     * @param {?} image
     * @return {?}
     */
    function (image) {
        image['viewerImageLoaded'] = true;
    };
    /**
     * direction (-1: left, 1: right)
     * swipe (user swiped)
     */
    /**
     * direction (-1: left, 1: right)
     * swipe (user swiped)
     * @param {?} direction
     * @param {?} swipe
     * @return {?}
     */
    ViewerComponent.prototype.navigate = /**
     * direction (-1: left, 1: right)
     * swipe (user swiped)
     * @param {?} direction
     * @param {?} swipe
     * @return {?}
     */
    function (direction, swipe) {
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
    };
    /**
     * @return {?}
     */
    ViewerComponent.prototype.showNavigationArrows = /**
     * @return {?}
     */
    function () {
        this.leftArrowVisible = true;
        this.rightArrowVisible = true;
    };
    /**
     * @return {?}
     */
    ViewerComponent.prototype.closeViewer = /**
     * @return {?}
     */
    function () {
        this.images.forEach((/**
         * @param {?} image
         * @return {?}
         */
        function (image) { return image['transition'] = undefined; }));
        this.images.forEach((/**
         * @param {?} image
         * @return {?}
         */
        function (image) { return image['active'] = false; }));
        this.imageService.showImageViewer(false);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    ViewerComponent.prototype.onKeydown = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        /** @type {?} */
        var prevent = [37, 39, 27, 36, 35]
            .find((/**
         * @param {?} no
         * @return {?}
         */
        function (no) { return no === event.keyCode; }));
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
    };
    /**
     * @private
     * @return {?}
     */
    ViewerComponent.prototype.hideNavigationArrows = /**
     * @private
     * @return {?}
     */
    function () {
        this.leftArrowVisible = false;
        this.rightArrowVisible = false;
    };
    /**
     * @private
     * @return {?}
     */
    ViewerComponent.prototype.updateImage = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        // wait for animation to end
        setTimeout((/**
         * @return {?}
         */
        function () {
            _this.updateQuality();
            _this.images[_this.currentIdx]['active'] = true;
            _this.images.forEach((/**
             * @param {?} image
             * @return {?}
             */
            function (image) {
                if (image != _this.images[_this.currentIdx]) {
                    image['active'] = false;
                    _this.transform = 0;
                }
            }));
        }), 100);
    };
    /**
     * @private
     * @return {?}
     */
    ViewerComponent.prototype.updateQuality = /**
     * @private
     * @return {?}
     */
    function () {
        /** @type {?} */
        var screenWidth = window.innerWidth;
        /** @type {?} */
        var screenHeight = window.innerHeight;
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
    };
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
    ViewerComponent.ctorParameters = function () { return [
        { type: ImageService }
    ]; };
    return ViewerComponent;
}());
export { ViewerComponent };
if (false) {
    /** @type {?} */
    ViewerComponent.prototype.showViewer;
    /** @type {?} */
    ViewerComponent.prototype.images;
    /** @type {?} */
    ViewerComponent.prototype.currentIdx;
    /** @type {?} */
    ViewerComponent.prototype.leftArrowVisible;
    /** @type {?} */
    ViewerComponent.prototype.rightArrowVisible;
    /** @type {?} */
    ViewerComponent.prototype.categorySelected;
    /** @type {?} */
    ViewerComponent.prototype.transform;
    /** @type {?} */
    ViewerComponent.prototype.math;
    /**
     * @type {?}
     * @private
     */
    ViewerComponent.prototype.qualitySelectorShown;
    /**
     * @type {?}
     * @private
     */
    ViewerComponent.prototype.qualitySelected;
    /**
     * @type {?}
     * @private
     */
    ViewerComponent.prototype.imageService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld2VyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXIyLWltYWdlLWdhbGxlcnkvIiwic291cmNlcyI6WyJsaWIvdmlld2VyL3ZpZXdlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQTtBQUN4RCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFBO0FBQ3pDLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLE1BQU0scUJBQXFCLENBQUE7QUFFaEY7SUF1RkkseUJBQW9CLFlBQTBCO1FBQTlDLGlCQWtCQztRQWxCbUIsaUJBQVksR0FBWixZQUFZLENBQWM7UUFWOUMsV0FBTSxHQUFlLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDekIsZUFBVSxHQUFXLENBQUMsQ0FBQTtRQUN0QixxQkFBZ0IsR0FBWSxJQUFJLENBQUE7UUFDaEMsc0JBQWlCLEdBQVksSUFBSSxDQUFBO1FBQ2pDLHFCQUFnQixHQUFXLGFBQWEsQ0FBQTtRQUdoQyx5QkFBb0IsR0FBWSxLQUFLLENBQUE7UUFDckMsb0JBQWUsR0FBVyxNQUFNLENBQUE7UUFHcEMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxTQUFTOzs7O1FBQ2pDLFVBQUEsTUFBTTtZQUNGLEtBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFBO1FBQ3hCLENBQUMsRUFBQyxDQUFBO1FBQ04sWUFBWSxDQUFDLDBCQUEwQixDQUFDLFNBQVM7Ozs7UUFDN0MsVUFBQSxRQUFRO1lBQ0osS0FBSSxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUE7WUFDMUIsS0FBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPOzs7O1lBQUMsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsS0FBSyxFQUF2QixDQUF1QixFQUFDLENBQUE7WUFDckQs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OzRCQUNILFVBQVUsQ0FBQyxXQUFXLEVBQUU7Z0NBQ3BCLEtBQUssQ0FBQztvQ0FDRixPQUFPLEVBQUUsQ0FBQztpQ0FDYixDQUFDO2dDQUNGLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQzs2QkFBQyxDQUM3Qjs0QkFDRCxVQUFVLENBQUMsV0FBVyxFQUFFO2dDQUNwQixLQUFLLENBQUM7b0NBQ0YsT0FBTyxFQUFFLENBQUM7aUNBQ2IsQ0FBQztnQ0FDRixPQUFPLENBQUMsZ0JBQWdCLENBQUM7NkJBQUMsQ0FDN0I7eUJBQ0osQ0FBQztxQkFDTDs7aUJBQ0o7Ozs7Z0JBN0VRLFlBQVk7O0lBa1JyQixzQkFBQztDQUFBLEFBOVFELElBOFFDO1NBbk1ZLGVBQWU7OztJQUN4QixxQ0FBbUI7O0lBQ25CLGlDQUF5Qjs7SUFDekIscUNBQXNCOztJQUN0QiwyQ0FBZ0M7O0lBQ2hDLDRDQUFpQzs7SUFDakMsMkNBQXdDOztJQUN4QyxvQ0FBaUI7O0lBQ2pCLCtCQUFVOzs7OztJQUNWLCtDQUE2Qzs7Ozs7SUFDN0MsMENBQXdDOzs7OztJQUU1Qix1Q0FBa0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbWFnZVNlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcy9pbWFnZS5zZXJ2aWNlJ1xuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSdcbmltcG9ydCB7IGFuaW1hdGUsIHN0YXRlLCBzdHlsZSwgdHJhbnNpdGlvbiwgdHJpZ2dlciB9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnXG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAndmlld2VyJyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vdmlld2VyLmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZVVybHM6IFsnLi92aWV3ZXIuY29tcG9uZW50LmNzcyddLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgJyhkb2N1bWVudDprZXlkb3duKSc6ICdvbktleWRvd24oJGV2ZW50KSdcbiAgICB9LFxuICAgIGFuaW1hdGlvbnM6IFtcbiAgICAgICAgdHJpZ2dlcignaW1hZ2VUcmFuc2l0aW9uJywgW1xuICAgICAgICAgICAgc3RhdGUoJ2VudGVyRnJvbVJpZ2h0Jywgc3R5bGUoe1xuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlKDBweCwgMHB4KSdcbiAgICAgICAgICAgIH0pKSxcbiAgICAgICAgICAgIHN0YXRlKCdlbnRlckZyb21MZWZ0Jywgc3R5bGUoe1xuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlKDBweCwgMHB4KSdcbiAgICAgICAgICAgIH0pKSxcbiAgICAgICAgICAgIHN0YXRlKCdsZWF2ZVRvTGVmdCcsIHN0eWxlKHtcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLFxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZSgtMTAwcHgsIDBweCknXG4gICAgICAgICAgICB9KSksXG4gICAgICAgICAgICBzdGF0ZSgnbGVhdmVUb1JpZ2h0Jywgc3R5bGUoe1xuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDAsXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlKDEwMHB4LCAwcHgpJ1xuICAgICAgICAgICAgfSkpLFxuICAgICAgICAgICAgdHJhbnNpdGlvbignKiA9PiBlbnRlckZyb21SaWdodCcsIFtcbiAgICAgICAgICAgICAgICBzdHlsZSh7XG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDAsXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZSgzMHB4LCAwcHgpJ1xuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIGFuaW1hdGUoJzEwMG1zIDI1MG1zIGVhc2UtaW4nKVxuICAgICAgICAgICAgXSksXG4gICAgICAgICAgICB0cmFuc2l0aW9uKCcqID0+IGVudGVyRnJvbUxlZnQnLCBbXG4gICAgICAgICAgICAgICAgc3R5bGUoe1xuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLFxuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGUoLTMwcHgsIDBweCknXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgYW5pbWF0ZSgnMTAwbXMgMjUwbXMgZWFzZS1pbicpXG4gICAgICAgICAgICBdKSxcbiAgICAgICAgICAgIHRyYW5zaXRpb24oJyogPT4gbGVhdmVUb0xlZnQnLCBbXG4gICAgICAgICAgICAgICAgc3R5bGUoe1xuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAxXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgYW5pbWF0ZSgnMTAwbXMgZWFzZS1vdXQnKV1cbiAgICAgICAgICAgICksXG4gICAgICAgICAgICB0cmFuc2l0aW9uKCcqID0+IGxlYXZlVG9SaWdodCcsIFtcbiAgICAgICAgICAgICAgICBzdHlsZSh7XG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDFcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBhbmltYXRlKCcxMDBtcyBlYXNlLW91dCcpXVxuICAgICAgICAgICAgKVxuICAgICAgICBdKSxcbiAgICAgICAgdHJpZ2dlcignc2hvd1ZpZXdlclRyYW5zaXRpb24nLCBbXG4gICAgICAgICAgICBzdGF0ZSgndHJ1ZScsIHN0eWxlKHtcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAxXG4gICAgICAgICAgICB9KSksXG4gICAgICAgICAgICBzdGF0ZSgndm9pZCcsIHN0eWxlKHtcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAwXG4gICAgICAgICAgICB9KSksXG4gICAgICAgICAgICB0cmFuc2l0aW9uKCd2b2lkID0+IConLCBbXG4gICAgICAgICAgICAgICAgc3R5bGUoe1xuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAwXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgYW5pbWF0ZSgnMTAwMG1zIGVhc2UtaW4nKV1cbiAgICAgICAgICAgICksXG4gICAgICAgICAgICB0cmFuc2l0aW9uKCcqID0+IHZvaWQnLCBbXG4gICAgICAgICAgICAgICAgc3R5bGUoe1xuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAxXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgYW5pbWF0ZSgnMjUwbXMgZWFzZS1vdXQnKV1cbiAgICAgICAgICAgIClcbiAgICAgICAgXSlcbiAgICBdXG59KVxuXG5leHBvcnQgY2xhc3MgVmlld2VyQ29tcG9uZW50IHtcbiAgICBzaG93Vmlld2VyOiBib29sZWFuXG4gICAgaW1hZ2VzOiBBcnJheTxhbnk+ID0gW3t9XVxuICAgIGN1cnJlbnRJZHg6IG51bWJlciA9IDBcbiAgICBsZWZ0QXJyb3dWaXNpYmxlOiBib29sZWFuID0gdHJ1ZVxuICAgIHJpZ2h0QXJyb3dWaXNpYmxlOiBib29sZWFuID0gdHJ1ZVxuICAgIGNhdGVnb3J5U2VsZWN0ZWQ6IHN0cmluZyA9ICdwcmV2aWV3X3h4cydcbiAgICB0cmFuc2Zvcm06IG51bWJlclxuICAgIG1hdGg6IE1hdGhcbiAgICBwcml2YXRlIHF1YWxpdHlTZWxlY3RvclNob3duOiBib29sZWFuID0gZmFsc2VcbiAgICBwcml2YXRlIHF1YWxpdHlTZWxlY3RlZDogc3RyaW5nID0gJ2F1dG8nXG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGltYWdlU2VydmljZTogSW1hZ2VTZXJ2aWNlKSB7XG4gICAgICAgIGltYWdlU2VydmljZS5pbWFnZXNVcGRhdGVkJC5zdWJzY3JpYmUoXG4gICAgICAgICAgICBpbWFnZXMgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2VzID0gaW1hZ2VzXG4gICAgICAgICAgICB9KVxuICAgICAgICBpbWFnZVNlcnZpY2UuaW1hZ2VTZWxlY3RlZEluZGV4VXBkYXRlZCQuc3Vic2NyaWJlKFxuICAgICAgICAgICAgbmV3SW5kZXggPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudElkeCA9IG5ld0luZGV4XG4gICAgICAgICAgICAgICAgdGhpcy5pbWFnZXMuZm9yRWFjaChpbWFnZSA9PiBpbWFnZVsnYWN0aXZlJ10gPSBmYWxzZSlcbiAgICAgICAgICAgICAgICB0aGlzLmltYWdlc1t0aGlzLmN1cnJlbnRJZHhdWydhY3RpdmUnXSA9IHRydWVcbiAgICAgICAgICAgICAgICB0aGlzLnRyYW5zZm9ybSA9IDBcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVF1YWxpdHkoKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgaW1hZ2VTZXJ2aWNlLnNob3dJbWFnZVZpZXdlckNoYW5nZWQkLnN1YnNjcmliZShcbiAgICAgICAgICAgIHNob3dWaWV3ZXIgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvd1ZpZXdlciA9IHNob3dWaWV3ZXJcbiAgICAgICAgICAgIH0pXG4gICAgICAgIHRoaXMubWF0aCA9IE1hdGhcbiAgICB9XG5cbiAgICBnZXQgbGVmdEFycm93QWN0aXZlKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50SWR4ID4gMFxuICAgIH1cblxuICAgIGdldCByaWdodEFycm93QWN0aXZlKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50SWR4IDwgdGhpcy5pbWFnZXMubGVuZ3RoIC0gMVxuICAgIH1cblxuICAgIHBhbihzd2lwZTogYW55KTogdm9pZCB7XG4gICAgICAgIHRoaXMudHJhbnNmb3JtID0gc3dpcGUuZGVsdGFYXG4gICAgfVxuXG4gICAgb25SZXNpemUoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuaW1hZ2VzLmZvckVhY2goaW1hZ2UgPT4ge1xuICAgICAgICAgICAgaW1hZ2VbJ3ZpZXdlckltYWdlTG9hZGVkJ10gPSBmYWxzZVxuICAgICAgICAgICAgaW1hZ2VbJ2FjdGl2ZSddID0gZmFsc2VcbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy51cGRhdGVJbWFnZSgpXG4gICAgfVxuXG4gICAgc2hvd1F1YWxpdHlTZWxlY3RvcigpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5xdWFsaXR5U2VsZWN0b3JTaG93biA9ICF0aGlzLnF1YWxpdHlTZWxlY3RvclNob3duXG4gICAgfVxuXG4gICAgcXVhbGl0eUNoYW5nZWQobmV3UXVhbGl0eTogYW55KTogdm9pZCB7XG4gICAgICAgIHRoaXMucXVhbGl0eVNlbGVjdGVkID0gbmV3UXVhbGl0eVxuICAgICAgICB0aGlzLnVwZGF0ZUltYWdlKClcbiAgICB9XG5cbiAgICBpbWFnZUxvYWRlZChpbWFnZTogYW55KTogdm9pZCB7XG4gICAgICAgIGltYWdlWyd2aWV3ZXJJbWFnZUxvYWRlZCddID0gdHJ1ZVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGRpcmVjdGlvbiAoLTE6IGxlZnQsIDE6IHJpZ2h0KVxuICAgICAqIHN3aXBlICh1c2VyIHN3aXBlZClcbiAgICAgKi9cbiAgICBuYXZpZ2F0ZShkaXJlY3Rpb246IG51bWJlciwgc3dpcGU6IGFueSk6IHZvaWQge1xuICAgICAgICBpZiAoKGRpcmVjdGlvbiA9PT0gMSAmJiB0aGlzLmN1cnJlbnRJZHggPCB0aGlzLmltYWdlcy5sZW5ndGggLSAxKSB8fFxuICAgICAgICAgICAgKGRpcmVjdGlvbiA9PT0gLTEgJiYgdGhpcy5jdXJyZW50SWR4ID4gMCkpIHtcblxuICAgICAgICAgICAgaWYgKGRpcmVjdGlvbiA9PSAtMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2VzW3RoaXMuY3VycmVudElkeF1bJ3RyYW5zaXRpb24nXSA9ICdsZWF2ZVRvUmlnaHQnXG4gICAgICAgICAgICAgICAgdGhpcy5pbWFnZXNbdGhpcy5jdXJyZW50SWR4IC0gMV1bJ3RyYW5zaXRpb24nXSA9ICdlbnRlckZyb21MZWZ0J1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmltYWdlc1t0aGlzLmN1cnJlbnRJZHhdWyd0cmFuc2l0aW9uJ10gPSAnbGVhdmVUb0xlZnQnXG4gICAgICAgICAgICAgICAgdGhpcy5pbWFnZXNbdGhpcy5jdXJyZW50SWR4ICsgMV1bJ3RyYW5zaXRpb24nXSA9ICdlbnRlckZyb21SaWdodCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY3VycmVudElkeCArPSBkaXJlY3Rpb25cblxuICAgICAgICAgICAgaWYgKHN3aXBlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlTmF2aWdhdGlvbkFycm93cygpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvd05hdmlnYXRpb25BcnJvd3MoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy51cGRhdGVJbWFnZSgpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzaG93TmF2aWdhdGlvbkFycm93cygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5sZWZ0QXJyb3dWaXNpYmxlID0gdHJ1ZVxuICAgICAgICB0aGlzLnJpZ2h0QXJyb3dWaXNpYmxlID0gdHJ1ZVxuICAgIH1cblxuICAgIGNsb3NlVmlld2VyKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmltYWdlcy5mb3JFYWNoKGltYWdlID0+IGltYWdlWyd0cmFuc2l0aW9uJ10gPSB1bmRlZmluZWQpXG4gICAgICAgIHRoaXMuaW1hZ2VzLmZvckVhY2goaW1hZ2UgPT4gaW1hZ2VbJ2FjdGl2ZSddID0gZmFsc2UpXG4gICAgICAgIHRoaXMuaW1hZ2VTZXJ2aWNlLnNob3dJbWFnZVZpZXdlcihmYWxzZSlcbiAgICB9XG5cbiAgICBvbktleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgcHJldmVudCA9IFszNywgMzksIDI3LCAzNiwgMzVdXG4gICAgICAgICAgICAuZmluZChubyA9PiBubyA9PT0gZXZlbnQua2V5Q29kZSlcbiAgICAgICAgaWYgKHByZXZlbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgfVxuXG4gICAgICAgIHN3aXRjaCAocHJldmVudCkge1xuICAgICAgICAgICAgY2FzZSAzNzpcbiAgICAgICAgICAgICAgICAvLyBuYXZpZ2F0ZSBsZWZ0XG4gICAgICAgICAgICAgICAgdGhpcy5uYXZpZ2F0ZSgtMSwgZmFsc2UpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgMzk6XG4gICAgICAgICAgICAgICAgLy8gbmF2aWdhdGUgcmlnaHRcbiAgICAgICAgICAgICAgICB0aGlzLm5hdmlnYXRlKDEsIGZhbHNlKVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlIDI3OlxuICAgICAgICAgICAgICAgIC8vIGVzY1xuICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VWaWV3ZXIoKVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlIDM2OlxuICAgICAgICAgICAgICAgIC8vIHBvcyAxXG4gICAgICAgICAgICAgICAgdGhpcy5pbWFnZXNbdGhpcy5jdXJyZW50SWR4XVsndHJhbnNpdGlvbiddID0gJ2xlYXZlVG9SaWdodCdcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRJZHggPSAwXG4gICAgICAgICAgICAgICAgdGhpcy5pbWFnZXNbdGhpcy5jdXJyZW50SWR4XVsndHJhbnNpdGlvbiddID0gJ2VudGVyRnJvbUxlZnQnXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVJbWFnZSgpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgMzU6XG4gICAgICAgICAgICAgICAgLy8gZW5kXG4gICAgICAgICAgICAgICAgdGhpcy5pbWFnZXNbdGhpcy5jdXJyZW50SWR4XVsndHJhbnNpdGlvbiddID0gJ2xlYXZlVG9MZWZ0J1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudElkeCA9IHRoaXMuaW1hZ2VzLmxlbmd0aCAtIDFcbiAgICAgICAgICAgICAgICB0aGlzLmltYWdlc1t0aGlzLmN1cnJlbnRJZHhdWyd0cmFuc2l0aW9uJ10gPSAnZW50ZXJGcm9tUmlnaHQnXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVJbWFnZSgpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgaGlkZU5hdmlnYXRpb25BcnJvd3MoKTogdm9pZCB7XG4gICAgICAgIHRoaXMubGVmdEFycm93VmlzaWJsZSA9IGZhbHNlXG4gICAgICAgIHRoaXMucmlnaHRBcnJvd1Zpc2libGUgPSBmYWxzZVxuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlSW1hZ2UoKTogdm9pZCB7XG4gICAgICAgIC8vIHdhaXQgZm9yIGFuaW1hdGlvbiB0byBlbmRcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVF1YWxpdHkoKVxuICAgICAgICAgICAgdGhpcy5pbWFnZXNbdGhpcy5jdXJyZW50SWR4XVsnYWN0aXZlJ10gPSB0cnVlXG4gICAgICAgICAgICB0aGlzLmltYWdlcy5mb3JFYWNoKGltYWdlID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoaW1hZ2UgIT0gdGhpcy5pbWFnZXNbdGhpcy5jdXJyZW50SWR4XSkge1xuICAgICAgICAgICAgICAgICAgICBpbWFnZVsnYWN0aXZlJ10gPSBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyYW5zZm9ybSA9IDBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9LCAxMDApXG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVRdWFsaXR5KCk6IHZvaWQge1xuICAgICAgICBjb25zdCBzY3JlZW5XaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoXG4gICAgICAgIGNvbnN0IHNjcmVlbkhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodFxuXG4gICAgICAgIHN3aXRjaCAodGhpcy5xdWFsaXR5U2VsZWN0ZWQpIHtcbiAgICAgICAgICAgIGNhc2UgJ2F1dG8nOiB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYXRlZ29yeVNlbGVjdGVkID0gJ3ByZXZpZXdfeHhzJ1xuXG4gICAgICAgICAgICAgICAgaWYgKHNjcmVlbldpZHRoID4gdGhpcy5pbWFnZXNbdGhpcy5jdXJyZW50SWR4XVsncHJldmlld194eHMnXS53aWR0aCAmJlxuICAgICAgICAgICAgICAgICAgICBzY3JlZW5IZWlnaHQgPiB0aGlzLmltYWdlc1t0aGlzLmN1cnJlbnRJZHhdWydwcmV2aWV3X3h4cyddLmhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhdGVnb3J5U2VsZWN0ZWQgPSAncHJldmlld194cydcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHNjcmVlbldpZHRoID4gdGhpcy5pbWFnZXNbdGhpcy5jdXJyZW50SWR4XVsncHJldmlld194cyddLndpZHRoICYmXG4gICAgICAgICAgICAgICAgICAgIHNjcmVlbkhlaWdodCA+IHRoaXMuaW1hZ2VzW3RoaXMuY3VycmVudElkeF1bJ3ByZXZpZXdfeHMnXS5oZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYXRlZ29yeVNlbGVjdGVkID0gJ3ByZXZpZXdfcydcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHNjcmVlbldpZHRoID4gdGhpcy5pbWFnZXNbdGhpcy5jdXJyZW50SWR4XVsncHJldmlld19zJ10ud2lkdGggJiZcbiAgICAgICAgICAgICAgICAgICAgc2NyZWVuSGVpZ2h0ID4gdGhpcy5pbWFnZXNbdGhpcy5jdXJyZW50SWR4XVsncHJldmlld19zJ10uaGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2F0ZWdvcnlTZWxlY3RlZCA9ICdyYXcnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlICdsb3cnOiB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYXRlZ29yeVNlbGVjdGVkID0gJ3ByZXZpZXdfeHhzJ1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlICdoaWdoJzoge1xuICAgICAgICAgICAgICAgIHRoaXMuY2F0ZWdvcnlTZWxlY3RlZCA9ICdyYXcnXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgICAgdGhpcy5jYXRlZ29yeVNlbGVjdGVkID0gJ3ByZXZpZXdfcydcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==