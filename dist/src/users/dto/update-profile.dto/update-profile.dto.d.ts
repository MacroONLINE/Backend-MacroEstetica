import { UpdateMedicoDto } from '../update-medico.dto';
import { UpdateEmpresaDto } from '../update-empresa.dto';
import { UpdateInstructorDto } from '../update-instructor.dto';
export declare class UpdateProfileDto {
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    province?: string;
    city?: string;
    country?: string;
    countryCode?: string;
    zipCode?: string;
    medico?: UpdateMedicoDto;
    empresa?: UpdateEmpresaDto;
    instructor?: UpdateInstructorDto;
}
