import { ImageService } from '../services/image.service';
export declare class ViewerComponent {
    private imageService;
    showViewer: boolean;
    images: Array<any>;
    currentIdx: number;
    leftArrowVisible: boolean;
    rightArrowVisible: boolean;
    categorySelected: string;
    transform: number;
    math: Math;
    private qualitySelectorShown;
    private qualitySelected;
    constructor(imageService: ImageService);
    readonly leftArrowActive: boolean;
    readonly rightArrowActive: boolean;
    pan(swipe: any): void;
    onResize(): void;
    showQualitySelector(): void;
    qualityChanged(newQuality: any): void;
    imageLoaded(image: any): void;
    /**
     * direction (-1: left, 1: right)
     * swipe (user swiped)
     */
    navigate(direction: number, swipe: any): void;
    showNavigationArrows(): void;
    closeViewer(): void;
    onKeydown(event: KeyboardEvent): void;
    private hideNavigationArrows;
    private updateImage;
    private updateQuality;
}
