import { IsNumberString, IsOptional } from "class-validator";

export class QueryPaginationDto {

    @IsOptional()
    @IsNumberString()
    page?: number

    @IsOptional()
    @IsNumberString()
    size?: number
}

export interface PaginateResponseDTO<T> {
    data: T[]
    meta: {
        total: number
        lastPage: number
        currentPage: number
        totalPerPage: number
        prevPage: number | null
        nextPage: number | null
    }
}