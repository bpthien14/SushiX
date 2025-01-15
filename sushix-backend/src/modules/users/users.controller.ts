import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { Employee } from './entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@ApiTags('employees')
@Controller('employees')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo nhân viên mới' })
  @ApiResponse({ 
    status: 201, 
    description: 'Nhân viên đã được tạo thành công.',
    type: Employee 
  })
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.usersService.create(createEmployeeDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() employee: Partial<Employee>) {
    return this.usersService.update(+id, employee);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.delete(+id);
  }
}