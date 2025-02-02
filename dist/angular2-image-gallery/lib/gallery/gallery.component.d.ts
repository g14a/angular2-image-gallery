import { ChangeDetectorRef, ElementRef, EventEmitter, OnChanges, OnDestroy, OnInit, QueryList, SimpleChanges } from '@angular/core';
import { ImageService } from '../services/image.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { HttpClient } from '@angular/common/http';
export declare class GalleryComponent implements OnInit, OnDestroy, OnChanges {
    imageService: ImageService;
    http: HttpClient;
    changeDetectorRef: ChangeDetectorRef;
    gallery: Array<any>;
    imageDataStaticPath: string;
    imageDataCompletePath: string;
    dataFileName: string;
    images: Array<any>;
    minimalQualityCategory: string;
    viewerSubscription: Subscription;
    rowIndex: number;
    rightArrowInactive: boolean;
    leftArrowInactive: boolean;
    providedImageMargin: number;
    providedImageSize: number;
    providedGalleryName: string;
    providedMetadataUri: string;
    rowsPerPage: number;
    viewerChange: EventEmitter<boolean>;
    galleryContainer: ElementRef;
    imageElements: QueryList<any>;
    triggerCycle(event: any): void;
    windowResize(event: any): void;
    constructor(imageService: ImageService, http: HttpClient, changeDetectorRef: ChangeDetectorRef);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    openImageViewer(img: any): void;
    /**
     * direction (-1: left, 1: right)
     */
    navigate(direction: number): void;
    calcImageMargin(): number;
    private fetchDataAndRender;
    private render;
    private shouldAddCandidate;
    private calcRowHeight;
    private calcOriginalRowWidth;
    private calcIdealHeight;
    private getGalleryWidth;
    private scaleGallery;
    private checkForAsyncLoading;
    private isScrolledIntoView;
    private refreshNavigationErrorState;
}
