import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { LibraryService } from './library.service';
import { AuthGuard } from '../auth/auth.guard';
import { UserUid } from '../decorator/user-uid.decorator';
import { GetUserLibraryResponseDto } from './dto/response/getUserLibrary.dto';
import { AddLibraryDto } from './dto/request/addToUserLibrary.dto';
import { RemoveLibraryDto } from './dto/request/removeLibraryDto';
import {
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Get('user')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get the user library' })
  @ApiOkResponse({
    description: 'Returns the full user library.',
    type: GetUserLibraryResponseDto,
    isArray: true,
  })
  @ApiInternalServerErrorResponse({
    description: 'Unexpected error while fetching the user library.',
  })
  async getUserLibrary(
    @UserUid() user_uid: string,
  ): Promise<GetUserLibraryResponseDto[]> {
    return this.libraryService.getUserLibrary(user_uid);
  }

  @Post('user')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Add an anime to the user library' })
  @ApiOkResponse({
    description:
      'Anime successfully added to the user library. Returns the updated user library.',
    type: GetUserLibraryResponseDto,
    isArray: true,
  })
  @ApiConflictResponse({
    description: 'The anime already exists in the user library.',
  })
  @ApiInternalServerErrorResponse({
    description:
      'Unexpected error while adding anime to the user library or fetching the updated library.',
  })
  async addUserLibrary(
    @UserUid() user_uid: string,
    @Body() dto: AddLibraryDto,
  ): Promise<GetUserLibraryResponseDto[]> {
    return this.libraryService.addToUserLibrary(user_uid, dto);
  }

  @Delete('user')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Remove an anime from the user library' })
  @ApiOkResponse({
    description:
      'Anime successfully removed. Returns the updated user library.',
    type: GetUserLibraryResponseDto,
    isArray: true,
  })
  @ApiNotFoundResponse({
    description: 'No record found to delete for the given user and malId.',
  })
  @ApiInternalServerErrorResponse({
    description:
      'Unexpected error while removing the anime or fetching the updated library.',
  })
  async removeFromUserLibrary(
    @UserUid() user_uid: string,
    @Body() dto: RemoveLibraryDto,
  ): Promise<GetUserLibraryResponseDto[]> {
    return this.libraryService.removeFromUserLibrary(user_uid, dto.malId);
  }
}
