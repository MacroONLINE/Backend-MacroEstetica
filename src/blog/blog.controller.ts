import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { BlogService } from './blog.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los posts del blog ordenados por fecha de creación' })
  @ApiResponse({ status: 200, description: 'Lista de blogs obtenida con éxito' })
  async getAllBlogs() {
    return this.blogService.getAllBlogs();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un post del blog por su ID' })
  @ApiParam({ name: 'id', description: 'ID del blog post', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'Blog encontrado' })
  @ApiResponse({ status: 404, description: 'Blog no encontrado' })
  async getBlogById(@Param('id') id: string) {
    const blog = await this.blogService.getBlogById(id);
    if (!blog) throw new NotFoundException('Blog no encontrado');
    return blog;
  }

  @Get('empresa/:empresaId')
  @ApiOperation({ summary: 'Obtener todos los posts de una empresa específica' })
  @ApiParam({ name: 'empresaId', description: 'ID de la empresa dueña del blog', example: '456e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'Lista de blogs obtenida' })
  async getBlogsByEmpresa(@Param('empresaId') empresaId: string) {
    return this.blogService.getBlogsByEmpresa(empresaId);
  }

  @Get('autor/:authorId')
  @ApiOperation({ summary: 'Obtener todos los posts de un autor específico' })
  @ApiParam({ name: 'authorId', description: 'ID del autor del blog', example: '789e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'Lista de blogs obtenida' })
  async getBlogsByAuthor(@Param('authorId') authorId: string) {
    return this.blogService.getBlogsByAuthor(authorId);
  }

  @Get('categoria/:categoryId')
  @ApiOperation({ summary: 'Obtener todos los posts de una categoría específica' })
  @ApiParam({ name: 'categoryId', description: 'ID de la categoría', example: 'abcde4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'Lista de blogs obtenida' })
  async getBlogsByCategory(@Param('categoryId') categoryId: string) {
    return this.blogService.getBlogsByCategory(categoryId);
  }

  @Get('mejor-calificados')
  @ApiOperation({ summary: 'Obtener los posts mejor calificados' })
  @ApiResponse({ status: 200, description: 'Lista de blogs mejor calificados' })
  async getTopRatedBlogs() {
    return this.blogService.getTopRatedBlogs();
  }

  @Get('recientes')
  @ApiOperation({ summary: 'Obtener los posts más recientes' })
  @ApiResponse({ status: 200, description: 'Lista de blogs más recientes' })
  async getRecentBlogs() {
    return this.blogService.getRecentBlogs();
  }

  @Get('busqueda')
  @ApiOperation({ summary: 'Buscar blogs por título o contenido' })
  @ApiQuery({ name: 'query', description: 'Texto de búsqueda', example: 'dermatología', required: true })
  @ApiResponse({ status: 200, description: 'Lista de blogs filtrados por búsqueda' })
  async searchBlogs(@Query('query') query: string) {
    return this.blogService.searchBlogs(query);
  }
}
