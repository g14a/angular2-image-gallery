import { Observable } from 'rxjs';
export declare class ImageService {
    private imagesUpdatedSource;
    private imageSelectedIndexUpdatedSource;
    private showImageViewerSource;
    imagesUpdated$: Observable<Array<any>>;
    imageSelectedIndexUpdated$: Observable<number>;
    showImageViewerChanged$: Observable<boolean>;
    updateImages(images: Array<any>): void;
    updateSelectedImageIndex(newIndex: number): void;
    showImageViewer(show: boolean): void;
}
