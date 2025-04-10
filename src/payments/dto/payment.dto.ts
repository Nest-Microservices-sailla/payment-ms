import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNumber, IsPositive, isString, IsString, ValidateNested } from "class-validator";

export class PaymentDto {

    @IsString()
    orderId: string
    
    @IsString()
    currency: string

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => PaymentItemsDto)
    items: PaymentItemsDto[]
}

export class PaymentItemsDto {

    @IsString()
    name: string

    @IsNumber()
    @IsPositive()
    price: number

    @IsNumber()
    @IsPositive()
    quantity: number
}



