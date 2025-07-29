import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { StudentImpairmentRepositoryI } from 'src/disability/domain/repositories';
import { StudentImpairmentI } from 'src/disability/domain/entitiesI';
import { StudentImpairmentResponseDto } from '../dtos';
import { StudentImpairmentAdapter } from '../adapters';

@Injectable()
export class StudentImpairmentRepositoryImp
  implements StudentImpairmentRepositoryI
{
  private readonly logger = new Logger(StudentImpairmentRepositoryImp.name);

  constructor(private readonly httpService: HttpService) {}

  async getStudentImpairmentDetails(
    studentId: number,
  ): Promise<StudentImpairmentI> {
    try {
      this.logger.log(
        `Fetching impairment details for student ID: ${studentId}`,
      );

      const response = await firstValueFrom(
        this.httpService
          .get<StudentImpairmentResponseDto>(
            `/api/preferences/student-impairments/students/${studentId}/details`,
          )
          .pipe(
            catchError((error) => {
              this.logger.error(
                `Failed to fetch impairment details for student ${studentId}`,
                error.stack,
              );

              // If student impairment not found, return default values
              if (error.response?.status === 404) {
                this.logger.warn(
                  `No impairment found for student ${studentId}, using defaults`,
                );
                return Promise.resolve({
                  data: {
                    success: true,
                    data: {
                      impairmentId: 0,
                      impairmentName: 'Sin discapacidad',
                      learningPathId: 1, // Default learning path
                    },
                    message: 'Default impairment data',
                  },
                });
              }

              throw new RpcException({
                status: HttpStatus.SERVICE_UNAVAILABLE,
                message: `Failed to fetch student impairment details: ${error.message}`,
              });
            }),
          ),
      );

      if (!response.data.success) {
        throw new RpcException({
          status: HttpStatus.BAD_REQUEST,
          message: `Service returned error: ${response.data.message}`,
        });
      }

      const impairmentData = StudentImpairmentAdapter.fromDtoToEntity(
        response.data.data,
      );

      this.logger.log(
        `Successfully fetched impairment details for student ${studentId}: ${impairmentData.impairmentName}`,
      );

      return impairmentData;
    } catch (error) {
      this.logger.error(
        `Error fetching impairment details for student ${studentId}`,
        error.stack,
      );

      if (error instanceof RpcException) {
        throw error;
      }

      // Fallback to default values if service is unavailable
      this.logger.warn(
        `Service unavailable, returning default impairment for student ${studentId}`,
      );
      return {
        impairmentId: 0,
        impairmentName: 'Sin discapacidad',
        learningPathId: 1,
      };
    }
  }
}
