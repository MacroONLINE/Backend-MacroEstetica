import { BannerService } from './banner.service';
import { CreateBannerDto } from './dto/banner.dto';
export declare class BannerController {
    private readonly bannerService;
    constructor(bannerService: BannerService);
    createBanner(body: CreateBannerDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        logo: string;
        title: string;
        description: string;
        empresaId: string | null;
        date: Date | null;
        banner: string;
        cta_url: string | null;
        cta_button_text: string;
    }>;
    getBannerById(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        logo: string;
        title: string;
        description: string;
        empresaId: string | null;
        date: Date | null;
        banner: string;
        cta_url: string | null;
        cta_button_text: string;
    }>;
    getRandomBanner(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        logo: string;
        title: string;
        description: string;
        empresaId: string | null;
        date: Date | null;
        banner: string;
        cta_url: string | null;
        cta_button_text: string;
    }>;
}
