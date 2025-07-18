import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateExcursionDto } from './dto/create-excursion-dto';
import { ExcursionsAdminService } from './excursions.admin.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Excursion } from './schemas/excursions.schema';
import { DeleteResult } from 'mongodb';
import { UpdateExcursionDto } from './dto/update-excursion-dto';
import { IRequestParams } from './interfaces/excursion.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwr-auth.guard';

@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@ApiTags('AdminExcursions')
@Controller('admin/excursions')
export class ExcursionsAdminController {
  constructor(private readonly excursionAdminService: ExcursionsAdminService) { }

  @ApiOperation({ summary: 'Get all cities' })
  @ApiResponse({ status: 200, type: [String] })
  @Get('cities-list')
  @HttpCode(HttpStatus.OK)
  async getCitiesList(): Promise<SelectItem[]> {
    const res = await this.excursionAdminService.getCitiesList();
    return res?.uniqueCities?.map((item: string, index: number) => ({
      id: index + 1,
      name: item,
    })) ?? [];
  }

  @ApiOperation({ summary: 'Create excursion' })
  @ApiResponse({ status: 201, type: Excursion })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() excursionDto: CreateExcursionDto) {
    try {
      await this.excursionAdminService.excursionCreate(excursionDto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something went wrong',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  @ApiOperation({ summary: 'Get all excursions' })
  @ApiResponse({ status: 200, type: [Excursion] })
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll(@Query() params: Partial<IRequestParams> & Record<string, any>): Promise<Excursion[]> {
    return await this.excursionAdminService.getAllExcursions(params);
  }

  @ApiOperation({ summary: 'Get one excursion' })
  @ApiResponse({ status: 200, type: [Excursion] })
  @Get(':id')
  async getOne(@Param('id') id: string): Promise<Excursion> {
    return await this.excursionAdminService.getExcursion(id);
  }

  @ApiOperation({ summary: 'Update excursion' })
  @ApiResponse({ status: 200, type: Excursion })
  @Put(':id')
  async update(
    @Body() excursionDto: UpdateExcursionDto,
    @Param('id') id: string,
  ): Promise<Excursion> {
    return await this.excursionAdminService.updateExcursion(id, excursionDto);
  }

  @ApiOperation({ summary: 'Delete excursion' })
  @ApiResponse({ status: 200, type: Boolean })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.excursionAdminService.deleteExcursion(id);
  }
}
