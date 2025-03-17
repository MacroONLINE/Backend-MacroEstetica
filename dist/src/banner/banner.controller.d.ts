import { BannerService } from './banner.service';
import { CreateBannerDto } from './dto/banner.dto';
export declare class BannerController {
    private readonly bannerService;
    constructor(bannerService: BannerService);
    createBanner(body: CreateBannerDto): Promise<{
        banner: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        title: string;
        empresaId: string | null;
        logo: string;
        date: Date | null;
        cta_url: string | null;
        cta_button_text: string;
    }>;
    getBannerById(id: string): Promise<{
        banner: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        title: string;
        empresaId: string | null;
        logo: string;
        date: Date | null;
        cta_url: string | null;
        cta_button_text: string;
    }>;
    getRandomBanner(): Promise<{
        banner: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        title: string;
        empresaId: string | null;
        logo: string;
        date: Date | null;
        cta_url: string | null;
        cta_button_text: string;
    }>;
}
