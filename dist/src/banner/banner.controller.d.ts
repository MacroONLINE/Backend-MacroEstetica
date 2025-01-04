import { BannerService } from './banner.service';
import { CreateBannerDto } from './dto/banner.dto';
export declare class BannerController {
    private readonly bannerService;
    constructor(bannerService: BannerService);
    createBanner(body: CreateBannerDto): Promise<{
        banner: string;
        id: string;
        title: string;
        description: string;
        date: Date | null;
        cta_url: string | null;
        cta_button_text: string;
        logo: string;
        empresaId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getBannerById(id: string): Promise<{
        banner: string;
        id: string;
        title: string;
        description: string;
        date: Date | null;
        cta_url: string | null;
        cta_button_text: string;
        logo: string;
        empresaId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getRandomBanner(): Promise<{
        banner: string;
        id: string;
        title: string;
        description: string;
        date: Date | null;
        cta_url: string | null;
        cta_button_text: string;
        logo: string;
        empresaId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
