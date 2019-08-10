/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { ImageService } from '../services/image.service';
import { Component } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
export class ViewerComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld2VyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXIyLWltYWdlLWdhbGxlcnkvIiwic291cmNlcyI6WyJsaWIvdmlld2VyL3ZpZXdlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQTtBQUN4RCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFBO0FBQ3pDLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLE1BQU0scUJBQXFCLENBQUE7QUE2RWhGLE1BQU0sT0FBTyxlQUFlOzs7O0lBWXhCLFlBQW9CLFlBQTBCO1FBQTFCLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBVjlDLFdBQU0sR0FBZSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQ3pCLGVBQVUsR0FBVyxDQUFDLENBQUE7UUFDdEIscUJBQWdCLEdBQVksSUFBSSxDQUFBO1FBQ2hDLHNCQUFpQixHQUFZLElBQUksQ0FBQTtRQUNqQyxxQkFBZ0IsR0FBVyxhQUFhLENBQUE7UUFHaEMseUJBQW9CLEdBQVksS0FBSyxDQUFBO1FBQ3JDLG9CQUFlLEdBQVcsTUFBTSxDQUFBO1FBR3BDLFlBQVksQ0FBQyxjQUFjLENBQUMsU0FBUzs7OztRQUNqQyxNQUFNLENBQUMsRUFBRTtZQUNMLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFBO1FBQ3hCLENBQUMsRUFBQyxDQUFBO1FBQ04sWUFBWSxDQUFDLDBCQUEwQixDQUFDLFNBQVM7Ozs7UUFDN0MsUUFBUSxDQUFDLEVBQUU7WUFDUCxJQUFJLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQTtZQUMxQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU87Ozs7WUFBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxLQUFLLEVBQUMsQ0FBQTtZQUNy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QU8sRUFBRSxDQUFDOzZCQUNiLENBQUM7NEJBQ0YsT0FBTyxDQUFDLGdCQUFnQixDQUFDO3lCQUFDLENBQzdCO3FCQUNKLENBQUM7aUJBQ0w7O2FBQ0o7Ozs7WUE3RVEsWUFBWTs7OztJQWdGakIscUNBQW1COztJQUNuQixpQ0FBeUI7O0lBQ3pCLHFDQUFzQjs7SUFDdEIsMkNBQWdDOztJQUNoQyw0Q0FBaUM7O0lBQ2pDLDJDQUF3Qzs7SUFDeEMsb0NBQWlCOztJQUNqQiwrQkFBVTs7Ozs7SUFDViwrQ0FBNkM7Ozs7O0lBQzdDLDBDQUF3Qzs7Ozs7SUFFNUIsdUNBQWtDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW1hZ2VTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvaW1hZ2Uuc2VydmljZSdcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnXG5pbXBvcnQgeyBhbmltYXRlLCBzdGF0ZSwgc3R5bGUsIHRyYW5zaXRpb24sIHRyaWdnZXIgfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJ1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3ZpZXdlcicsXG4gICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdlci5jb21wb25lbnQuaHRtbCcsXG4gICAgc3R5bGVVcmxzOiBbJy4vdmlld2VyLmNvbXBvbmVudC5jc3MnXSxcbiAgICBob3N0OiB7XG4gICAgICAgICcoZG9jdW1lbnQ6a2V5ZG93biknOiAnb25LZXlkb3duKCRldmVudCknXG4gICAgfSxcbiAgICBhbmltYXRpb25zOiBbXG4gICAgICAgIHRyaWdnZXIoJ2ltYWdlVHJhbnNpdGlvbicsIFtcbiAgICAgICAgICAgIHN0YXRlKCdlbnRlckZyb21SaWdodCcsIHN0eWxlKHtcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZSgwcHgsIDBweCknXG4gICAgICAgICAgICB9KSksXG4gICAgICAgICAgICBzdGF0ZSgnZW50ZXJGcm9tTGVmdCcsIHN0eWxlKHtcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZSgwcHgsIDBweCknXG4gICAgICAgICAgICB9KSksXG4gICAgICAgICAgICBzdGF0ZSgnbGVhdmVUb0xlZnQnLCBzdHlsZSh7XG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMCxcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGUoLTEwMHB4LCAwcHgpJ1xuICAgICAgICAgICAgfSkpLFxuICAgICAgICAgICAgc3RhdGUoJ2xlYXZlVG9SaWdodCcsIHN0eWxlKHtcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLFxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZSgxMDBweCwgMHB4KSdcbiAgICAgICAgICAgIH0pKSxcbiAgICAgICAgICAgIHRyYW5zaXRpb24oJyogPT4gZW50ZXJGcm9tUmlnaHQnLCBbXG4gICAgICAgICAgICAgICAgc3R5bGUoe1xuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLFxuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGUoMzBweCwgMHB4KSdcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBhbmltYXRlKCcxMDBtcyAyNTBtcyBlYXNlLWluJylcbiAgICAgICAgICAgIF0pLFxuICAgICAgICAgICAgdHJhbnNpdGlvbignKiA9PiBlbnRlckZyb21MZWZ0JywgW1xuICAgICAgICAgICAgICAgIHN0eWxlKHtcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMCxcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlKC0zMHB4LCAwcHgpJ1xuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIGFuaW1hdGUoJzEwMG1zIDI1MG1zIGVhc2UtaW4nKVxuICAgICAgICAgICAgXSksXG4gICAgICAgICAgICB0cmFuc2l0aW9uKCcqID0+IGxlYXZlVG9MZWZ0JywgW1xuICAgICAgICAgICAgICAgIHN0eWxlKHtcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMVxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIGFuaW1hdGUoJzEwMG1zIGVhc2Utb3V0JyldXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgdHJhbnNpdGlvbignKiA9PiBsZWF2ZVRvUmlnaHQnLCBbXG4gICAgICAgICAgICAgICAgc3R5bGUoe1xuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAxXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgYW5pbWF0ZSgnMTAwbXMgZWFzZS1vdXQnKV1cbiAgICAgICAgICAgIClcbiAgICAgICAgXSksXG4gICAgICAgIHRyaWdnZXIoJ3Nob3dWaWV3ZXJUcmFuc2l0aW9uJywgW1xuICAgICAgICAgICAgc3RhdGUoJ3RydWUnLCBzdHlsZSh7XG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMVxuICAgICAgICAgICAgfSkpLFxuICAgICAgICAgICAgc3RhdGUoJ3ZvaWQnLCBzdHlsZSh7XG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMFxuICAgICAgICAgICAgfSkpLFxuICAgICAgICAgICAgdHJhbnNpdGlvbigndm9pZCA9PiAqJywgW1xuICAgICAgICAgICAgICAgIHN0eWxlKHtcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMFxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIGFuaW1hdGUoJzEwMDBtcyBlYXNlLWluJyldXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgdHJhbnNpdGlvbignKiA9PiB2b2lkJywgW1xuICAgICAgICAgICAgICAgIHN0eWxlKHtcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMVxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIGFuaW1hdGUoJzI1MG1zIGVhc2Utb3V0JyldXG4gICAgICAgICAgICApXG4gICAgICAgIF0pXG4gICAgXVxufSlcblxuZXhwb3J0IGNsYXNzIFZpZXdlckNvbXBvbmVudCB7XG4gICAgc2hvd1ZpZXdlcjogYm9vbGVhblxuICAgIGltYWdlczogQXJyYXk8YW55PiA9IFt7fV1cbiAgICBjdXJyZW50SWR4OiBudW1iZXIgPSAwXG4gICAgbGVmdEFycm93VmlzaWJsZTogYm9vbGVhbiA9IHRydWVcbiAgICByaWdodEFycm93VmlzaWJsZTogYm9vbGVhbiA9IHRydWVcbiAgICBjYXRlZ29yeVNlbGVjdGVkOiBzdHJpbmcgPSAncHJldmlld194eHMnXG4gICAgdHJhbnNmb3JtOiBudW1iZXJcbiAgICBtYXRoOiBNYXRoXG4gICAgcHJpdmF0ZSBxdWFsaXR5U2VsZWN0b3JTaG93bjogYm9vbGVhbiA9IGZhbHNlXG4gICAgcHJpdmF0ZSBxdWFsaXR5U2VsZWN0ZWQ6IHN0cmluZyA9ICdhdXRvJ1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBpbWFnZVNlcnZpY2U6IEltYWdlU2VydmljZSkge1xuICAgICAgICBpbWFnZVNlcnZpY2UuaW1hZ2VzVXBkYXRlZCQuc3Vic2NyaWJlKFxuICAgICAgICAgICAgaW1hZ2VzID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmltYWdlcyA9IGltYWdlc1xuICAgICAgICAgICAgfSlcbiAgICAgICAgaW1hZ2VTZXJ2aWNlLmltYWdlU2VsZWN0ZWRJbmRleFVwZGF0ZWQkLnN1YnNjcmliZShcbiAgICAgICAgICAgIG5ld0luZGV4ID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRJZHggPSBuZXdJbmRleFxuICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2VzLmZvckVhY2goaW1hZ2UgPT4gaW1hZ2VbJ2FjdGl2ZSddID0gZmFsc2UpXG4gICAgICAgICAgICAgICAgdGhpcy5pbWFnZXNbdGhpcy5jdXJyZW50SWR4XVsnYWN0aXZlJ10gPSB0cnVlXG4gICAgICAgICAgICAgICAgdGhpcy50cmFuc2Zvcm0gPSAwXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVRdWFsaXR5KClcbiAgICAgICAgICAgIH0pXG4gICAgICAgIGltYWdlU2VydmljZS5zaG93SW1hZ2VWaWV3ZXJDaGFuZ2VkJC5zdWJzY3JpYmUoXG4gICAgICAgICAgICBzaG93Vmlld2VyID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dWaWV3ZXIgPSBzaG93Vmlld2VyXG4gICAgICAgICAgICB9KVxuICAgICAgICB0aGlzLm1hdGggPSBNYXRoXG4gICAgfVxuXG4gICAgZ2V0IGxlZnRBcnJvd0FjdGl2ZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudElkeCA+IDBcbiAgICB9XG5cbiAgICBnZXQgcmlnaHRBcnJvd0FjdGl2ZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudElkeCA8IHRoaXMuaW1hZ2VzLmxlbmd0aCAtIDFcbiAgICB9XG5cbiAgICBwYW4oc3dpcGU6IGFueSk6IHZvaWQge1xuICAgICAgICB0aGlzLnRyYW5zZm9ybSA9IHN3aXBlLmRlbHRhWFxuICAgIH1cblxuICAgIG9uUmVzaXplKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmltYWdlcy5mb3JFYWNoKGltYWdlID0+IHtcbiAgICAgICAgICAgIGltYWdlWyd2aWV3ZXJJbWFnZUxvYWRlZCddID0gZmFsc2VcbiAgICAgICAgICAgIGltYWdlWydhY3RpdmUnXSA9IGZhbHNlXG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMudXBkYXRlSW1hZ2UoKVxuICAgIH1cblxuICAgIHNob3dRdWFsaXR5U2VsZWN0b3IoKTogdm9pZCB7XG4gICAgICAgIHRoaXMucXVhbGl0eVNlbGVjdG9yU2hvd24gPSAhdGhpcy5xdWFsaXR5U2VsZWN0b3JTaG93blxuICAgIH1cblxuICAgIHF1YWxpdHlDaGFuZ2VkKG5ld1F1YWxpdHk6IGFueSk6IHZvaWQge1xuICAgICAgICB0aGlzLnF1YWxpdHlTZWxlY3RlZCA9IG5ld1F1YWxpdHlcbiAgICAgICAgdGhpcy51cGRhdGVJbWFnZSgpXG4gICAgfVxuXG4gICAgaW1hZ2VMb2FkZWQoaW1hZ2U6IGFueSk6IHZvaWQge1xuICAgICAgICBpbWFnZVsndmlld2VySW1hZ2VMb2FkZWQnXSA9IHRydWVcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBkaXJlY3Rpb24gKC0xOiBsZWZ0LCAxOiByaWdodClcbiAgICAgKiBzd2lwZSAodXNlciBzd2lwZWQpXG4gICAgICovXG4gICAgbmF2aWdhdGUoZGlyZWN0aW9uOiBudW1iZXIsIHN3aXBlOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgaWYgKChkaXJlY3Rpb24gPT09IDEgJiYgdGhpcy5jdXJyZW50SWR4IDwgdGhpcy5pbWFnZXMubGVuZ3RoIC0gMSkgfHxcbiAgICAgICAgICAgIChkaXJlY3Rpb24gPT09IC0xICYmIHRoaXMuY3VycmVudElkeCA+IDApKSB7XG5cbiAgICAgICAgICAgIGlmIChkaXJlY3Rpb24gPT0gLTEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmltYWdlc1t0aGlzLmN1cnJlbnRJZHhdWyd0cmFuc2l0aW9uJ10gPSAnbGVhdmVUb1JpZ2h0J1xuICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2VzW3RoaXMuY3VycmVudElkeCAtIDFdWyd0cmFuc2l0aW9uJ10gPSAnZW50ZXJGcm9tTGVmdCdcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbWFnZXNbdGhpcy5jdXJyZW50SWR4XVsndHJhbnNpdGlvbiddID0gJ2xlYXZlVG9MZWZ0J1xuICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2VzW3RoaXMuY3VycmVudElkeCArIDFdWyd0cmFuc2l0aW9uJ10gPSAnZW50ZXJGcm9tUmlnaHQnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRJZHggKz0gZGlyZWN0aW9uXG5cbiAgICAgICAgICAgIGlmIChzd2lwZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuaGlkZU5hdmlnYXRpb25BcnJvd3MoKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dOYXZpZ2F0aW9uQXJyb3dzKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMudXBkYXRlSW1hZ2UoKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2hvd05hdmlnYXRpb25BcnJvd3MoKTogdm9pZCB7XG4gICAgICAgIHRoaXMubGVmdEFycm93VmlzaWJsZSA9IHRydWVcbiAgICAgICAgdGhpcy5yaWdodEFycm93VmlzaWJsZSA9IHRydWVcbiAgICB9XG5cbiAgICBjbG9zZVZpZXdlcigpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5pbWFnZXMuZm9yRWFjaChpbWFnZSA9PiBpbWFnZVsndHJhbnNpdGlvbiddID0gdW5kZWZpbmVkKVxuICAgICAgICB0aGlzLmltYWdlcy5mb3JFYWNoKGltYWdlID0+IGltYWdlWydhY3RpdmUnXSA9IGZhbHNlKVxuICAgICAgICB0aGlzLmltYWdlU2VydmljZS5zaG93SW1hZ2VWaWV3ZXIoZmFsc2UpXG4gICAgfVxuXG4gICAgb25LZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHByZXZlbnQgPSBbMzcsIDM5LCAyNywgMzYsIDM1XVxuICAgICAgICAgICAgLmZpbmQobm8gPT4gbm8gPT09IGV2ZW50LmtleUNvZGUpXG4gICAgICAgIGlmIChwcmV2ZW50KSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIH1cblxuICAgICAgICBzd2l0Y2ggKHByZXZlbnQpIHtcbiAgICAgICAgICAgIGNhc2UgMzc6XG4gICAgICAgICAgICAgICAgLy8gbmF2aWdhdGUgbGVmdFxuICAgICAgICAgICAgICAgIHRoaXMubmF2aWdhdGUoLTEsIGZhbHNlKVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlIDM5OlxuICAgICAgICAgICAgICAgIC8vIG5hdmlnYXRlIHJpZ2h0XG4gICAgICAgICAgICAgICAgdGhpcy5uYXZpZ2F0ZSgxLCBmYWxzZSlcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAyNzpcbiAgICAgICAgICAgICAgICAvLyBlc2NcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3NlVmlld2VyKClcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAzNjpcbiAgICAgICAgICAgICAgICAvLyBwb3MgMVxuICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2VzW3RoaXMuY3VycmVudElkeF1bJ3RyYW5zaXRpb24nXSA9ICdsZWF2ZVRvUmlnaHQnXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50SWR4ID0gMFxuICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2VzW3RoaXMuY3VycmVudElkeF1bJ3RyYW5zaXRpb24nXSA9ICdlbnRlckZyb21MZWZ0J1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlSW1hZ2UoKVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlIDM1OlxuICAgICAgICAgICAgICAgIC8vIGVuZFxuICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2VzW3RoaXMuY3VycmVudElkeF1bJ3RyYW5zaXRpb24nXSA9ICdsZWF2ZVRvTGVmdCdcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRJZHggPSB0aGlzLmltYWdlcy5sZW5ndGggLSAxXG4gICAgICAgICAgICAgICAgdGhpcy5pbWFnZXNbdGhpcy5jdXJyZW50SWR4XVsndHJhbnNpdGlvbiddID0gJ2VudGVyRnJvbVJpZ2h0J1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlSW1hZ2UoKVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGhpZGVOYXZpZ2F0aW9uQXJyb3dzKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmxlZnRBcnJvd1Zpc2libGUgPSBmYWxzZVxuICAgICAgICB0aGlzLnJpZ2h0QXJyb3dWaXNpYmxlID0gZmFsc2VcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZUltYWdlKCk6IHZvaWQge1xuICAgICAgICAvLyB3YWl0IGZvciBhbmltYXRpb24gdG8gZW5kXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVRdWFsaXR5KClcbiAgICAgICAgICAgIHRoaXMuaW1hZ2VzW3RoaXMuY3VycmVudElkeF1bJ2FjdGl2ZSddID0gdHJ1ZVxuICAgICAgICAgICAgdGhpcy5pbWFnZXMuZm9yRWFjaChpbWFnZSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGltYWdlICE9IHRoaXMuaW1hZ2VzW3RoaXMuY3VycmVudElkeF0pIHtcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VbJ2FjdGl2ZSddID0gZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cmFuc2Zvcm0gPSAwXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSwgMTAwKVxuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlUXVhbGl0eSgpOiB2b2lkIHtcbiAgICAgICAgY29uc3Qgc2NyZWVuV2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aFxuICAgICAgICBjb25zdCBzY3JlZW5IZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHRcblxuICAgICAgICBzd2l0Y2ggKHRoaXMucXVhbGl0eVNlbGVjdGVkKSB7XG4gICAgICAgICAgICBjYXNlICdhdXRvJzoge1xuICAgICAgICAgICAgICAgIHRoaXMuY2F0ZWdvcnlTZWxlY3RlZCA9ICdwcmV2aWV3X3h4cydcblxuICAgICAgICAgICAgICAgIGlmIChzY3JlZW5XaWR0aCA+IHRoaXMuaW1hZ2VzW3RoaXMuY3VycmVudElkeF1bJ3ByZXZpZXdfeHhzJ10ud2lkdGggJiZcbiAgICAgICAgICAgICAgICAgICAgc2NyZWVuSGVpZ2h0ID4gdGhpcy5pbWFnZXNbdGhpcy5jdXJyZW50SWR4XVsncHJldmlld194eHMnXS5oZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYXRlZ29yeVNlbGVjdGVkID0gJ3ByZXZpZXdfeHMnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzY3JlZW5XaWR0aCA+IHRoaXMuaW1hZ2VzW3RoaXMuY3VycmVudElkeF1bJ3ByZXZpZXdfeHMnXS53aWR0aCAmJlxuICAgICAgICAgICAgICAgICAgICBzY3JlZW5IZWlnaHQgPiB0aGlzLmltYWdlc1t0aGlzLmN1cnJlbnRJZHhdWydwcmV2aWV3X3hzJ10uaGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2F0ZWdvcnlTZWxlY3RlZCA9ICdwcmV2aWV3X3MnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzY3JlZW5XaWR0aCA+IHRoaXMuaW1hZ2VzW3RoaXMuY3VycmVudElkeF1bJ3ByZXZpZXdfcyddLndpZHRoICYmXG4gICAgICAgICAgICAgICAgICAgIHNjcmVlbkhlaWdodCA+IHRoaXMuaW1hZ2VzW3RoaXMuY3VycmVudElkeF1bJ3ByZXZpZXdfcyddLmhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhdGVnb3J5U2VsZWN0ZWQgPSAncmF3J1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSAnbG93Jzoge1xuICAgICAgICAgICAgICAgIHRoaXMuY2F0ZWdvcnlTZWxlY3RlZCA9ICdwcmV2aWV3X3h4cydcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSAnaGlnaCc6IHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhdGVnb3J5U2VsZWN0ZWQgPSAncmF3J1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICAgIHRoaXMuY2F0ZWdvcnlTZWxlY3RlZCA9ICdwcmV2aWV3X3MnXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=