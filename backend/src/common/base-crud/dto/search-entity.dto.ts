import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, Max, Min } from "class-validator";

export class Criteria {
  [column: string]: string;
}

export class Criterion {
  @ApiProperty()
  @IsNotEmpty()
  column: string;

  @ApiProperty()
  @IsNotEmpty()
  value: string;
}

export class SearchEntitiesDto {
  @ApiProperty({ default: 1, minimum: 1 })
  @Min(1)
  @IsOptional()
  pageNo: number = 1;

  @ApiProperty({ default: 10, minimum: 1, maximum: 20})
  @Min(1)
  @Max(20)
  @IsOptional()
  pageSize: number = 10;

  @ApiProperty({ default: true, required: false })
  @IsOptional()
  ascending: boolean = true;

  @ApiProperty({ default: "id" })
  @IsOptional()
  orderByColumn: string = "id";

  @ApiProperty({ default: {}, required: false })
  @IsOptional()
  criteria: Criteria = {};//Criterion[] = [];
}