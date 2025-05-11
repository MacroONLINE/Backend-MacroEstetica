import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { BlogService } from './blog.service';

class VoteCommentDto {
  userId: string;
  useful: boolean;
  commentContent: string;
  rating: number;
}

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los posts del blog, ordenados por fecha de creación (desc)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de blogs obtenida con éxito',
  })
  async getAllBlogs() {
    return this.blogService.getAllBlogs();
  }

  @Get('empresa/:empresaId')
  @ApiOperation({ summary: 'Obtener todos los posts de una empresa específica' })
  @ApiParam({
    name: 'empresaId',
    description: 'ID de la empresa dueña del blog',
    example: '456e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({ status: 200, description: 'Lista de blogs obtenida' })
  async getBlogsByEmpresa(@Param('empresaId') empresaId: string) {
    return this.blogService.getBlogsByEmpresa(empresaId);
  }

  @Get('autor/:authorId')
  @ApiOperation({ summary: 'Obtener todos los posts de un autor específico' })
  @ApiParam({
    name: 'authorId',
    description: 'ID del autor del blog (BlogAuthor)',
    example: '789e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({ status: 200, description: 'Lista de blogs obtenida' })
  async getBlogsByAuthor(@Param('authorId') authorId: string) {
    return this.blogService.getBlogsByAuthor(authorId);
  }

  @Get('categoria/:categoryId')
  @ApiOperation({
    summary: 'Obtener todos los posts de una categoría específica',
  })
  @ApiParam({
    name: 'categoryId',
    description: 'ID de la categoría',
    example: 'abcde4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({ status: 200, description: 'Lista de blogs obtenida' })
  async getBlogsByCategory(@Param('categoryId') categoryId: string) {
    return this.blogService.getBlogsByCategory(categoryId);
  }

  @Get('mejor-calificados')
  @ApiOperation({ summary: 'Obtener los posts mejor calificados' })
  @ApiResponse({
    status: 200,
    description: 'Lista de blogs mejor calificados',
  })
  async getTopRatedBlogs() {
    return this.blogService.getTopRatedBlogs();
  }

  @Get('recientes')
  @ApiOperation({ summary: 'Obtener los posts más recientes' })
  @ApiResponse({
    status: 200,
    description: 'Lista de blogs más recientes',
  })
  async getRecentBlogs() {
    return this.blogService.getRecentBlogs();
  }

  /**
   * Buscar blogs por título o palabras clave (keywords),
   * sin importar acentos ni mayúsculas.
   */
  @Get('busqueda')
  @ApiOperation({
    summary: 'Buscar blogs por título o keywords',
  })
  @ApiQuery({
    name: 'query',
    description: 'Texto a buscar en título o keywords',
    required: true,
    example: 'dermatologia',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de blogs que coinciden con la búsqueda',
  })
  async searchBlogs(@Query('query') query: string) {
    return this.blogService.searchBlogs(query);
  }

  @Post(':id/vote-comment')
  @ApiOperation({
    summary:
      'Votar utilidad (útil o no) y comentar un blog en una sola acción, incluyendo rating (1 a 5)',
  })
  @ApiParam({ name: 'id', description: 'ID del blog post' })
  @ApiBody({
    description: 'Datos del voto, rating y comentario',
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        useful: { type: 'boolean' },
        commentContent: { type: 'string' },
        rating: { type: 'number', minimum: 1, maximum: 5 },
      },
      required: ['userId', 'useful', 'commentContent', 'rating'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Voto, comentario y rating registrados correctamente',
  })
  @ApiResponse({
    status: 400,
    description: 'El usuario ya ha comentado o calificado este post, o rating fuera de rango',
  })
  @ApiResponse({ status: 404, description: 'Blog no encontrado' })
  async voteAndComment(@Param('id') id: string, @Body() voteCommentDto: VoteCommentDto) {
    this.blogService.setCurrentDto(voteCommentDto);
    return this.blogService.voteAndComment(
      id,
      voteCommentDto.userId,
      voteCommentDto.useful,
      voteCommentDto.commentContent,
    );
  }

  @Get('categories')
  @ApiOperation({ summary: 'Obtener todas las categorías de blog' })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorías obtenida con éxito',
  })
  async getAllCategories() {
    return this.blogService.getAllCategories();
  }

  @Post(':id/increment-reader')
  @ApiOperation({
    summary: 'Incrementar el contador de lectores de un blog',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del blog',
    example: 'blog-001',
  })
  @ApiResponse({
    status: 200,
    description: 'Número total de lectores actualizado',
  })
  async incrementReaderCount(@Param('id') id: string) {
    return this.blogService.incrementReaderCount(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un post del blog por su ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del blog post',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({ status: 200, description: 'Blog encontrado' })
  @ApiResponse({ status: 404, description: 'Blog no encontrado' })
  async getBlogById(@Param('id') id: string) {
    const blog = await this.blogService.getBlogById(id);
    if (!blog) throw new NotFoundException('Blog no encontrado');
    return blog;
  }

  @Get(':id/comment-rating')
  @ApiOperation({
    summary: 'Obtener, por cada usuario, su comentario y rating en un blog, junto con nombre e imagen',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del blog post',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios con su comentario y rating',
  })
  @ApiResponse({ status: 404, description: 'Blog no encontrado' })
  async getUsersCommentRatingForPost(@Param('id') id: string) {
    const blog = await this.blogService.getBlogById(id);
    if (!blog) throw new NotFoundException('Blog no encontrado');
    return this.blogService.getUsersCommentRatingForPost(id);
  }
}
