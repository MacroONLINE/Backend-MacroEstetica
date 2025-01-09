import { BannerService } from './banner.service';
import { CreateBannerDto } from './dto/banner.dto';
export declare class BannerController {
    private readonly bannerService;
    constructor(bannerService: BannerService);
    createBanner(body: CreateBannerDto): Promise<{
        id: string;
        description: string;
        empresaId: string | null;
        createdAt: Date;
        updatedAt: Date;
        logo: string;
        title: string;
        banner: string;
        date: Date | null;
        cta_url: string | null;
        cta_button_text: string;
    }>;
    getBannerById(id: string): Promise<{
        id: string;
        description: string;
        empresaId: string | null;
        createdAt: Date;
        updatedAt: Date;
        logo: string;
        title: string;
        banner: string;
        date: Date | null;
        cta_url: string | null;
        cta_button_text: string;
    }>;
    getRandomBanner(): Promise<{
        id: string;
        description: string;
        empresaId: string | null;
        createdAt: Date;
        updatedAt: Date;
        logo: string;
        title: string;
        banner: string;
        date: Date | null;
        cta_url: string | null;
        cta_button_text: string;
    }>;
}
