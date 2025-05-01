import { Success } from '@/modules/auth/interfaces/auth.interface';
import { apiClient } from '@/shared/api/api';
import { UrlResponse } from '@/shared/types/url';

import type { Paginated, PaginationDto } from '../../../shared/types/pagination';
import { objectToSearchParams } from '../../../shared/utils/converters.utils';
import type {
  Company,
  CompanyDto,
  CompanyPromoCode,
  CompanyPromoCodeDto,
  CompanySubscription
} from '../interfaces/company.interface';
import type { CompanyNews, CompanyNewsDto } from '../interfaces/news.interface';

export enum CompanySortBy {
  NAME = 'name',
  EVENTS = 'events',
  NEWEST = 'newest',
  OLDEST = 'oldest'
}

export interface CompanyGetManyDto extends PaginationDto {
  search?: string;
  lat?: number;
  lng?: number;
  ownerId?: string;
  sortBy?: CompanySortBy;
  isVerified?: boolean;
}

export class CompanyService {
  static create(dto: CompanyDto) {
    return apiClient.post('companies', { json: dto }).json<Company>();
  }

  static update(id: string, dto: Partial<CompanyDto>) {
    return apiClient.patch(`companies/${id}`, { json: dto }).json<Company>();
  }

  static updateLogo(id: string, file: File) {
    const dto = new FormData();
    dto.append('logo', file);

    return apiClient.patch(`companies/${id}/logo`, { body: dto }).json<Success>();
  }

  static updateCover(id: string, file: File) {
    const dto = new FormData();
    dto.append('cover', file);

    return apiClient.patch(`companies/${id}/cover`, { body: dto }).json<Success>();
  }

  static getById(id: string) {
    return apiClient.get(`companies/${id}`).json<Company>();
  }

  static delete(id: string) {
    return apiClient.delete(`companies/${id}`);
  }

  static getMany(opt: CompanyGetManyDto): Promise<Paginated<Company>> {
    const searchParams = objectToSearchParams(opt);
    return apiClient.get('companies', { searchParams }).json<Paginated<Company>>();
  }

  static createNewsItem(dto: CompanyNewsDto) {
    return apiClient.post('companies-news', { json: dto }).json<CompanyNews>();
  }

  static updateNewsItem(id: string, dto: CompanyNewsDto) {
    return apiClient.patch(`companies-news/${id}`, { json: dto }).json<CompanyNews>();
  }

  static updateNewsItemCover(id: string, file: File) {
    const dto = new FormData();
    dto.append('cover', file);

    return apiClient.patch(`companies-news/${id}/cover`, { body: dto }).json<Success>();
  }

  static deleteNewsItem(id: string) {
    return apiClient.delete(`companies-news/${id}`);
  }

  static getCompanyNews(companyId: string, opt?: PaginationDto): Promise<Paginated<CompanyNews>> {
    const searchParams = opt && objectToSearchParams(opt);

    return apiClient.get(`companies-news/company/${companyId}`, { searchParams }).json<Paginated<CompanyNews>>();
  }

  static getNewsItem(newsId: string): Promise<CompanyNews> {
    return apiClient.get(`companies-news/${newsId}`).json<CompanyNews>();
  }

  static getMyCompanies(page = 1, limit = 10): Promise<Paginated<Company>> {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('limit', limit.toString());

    return apiClient
      .get('companies/my', {
        searchParams: params
      })
      .json<Paginated<Company>>();
  }
  static getSubscriptionsCount(): Promise<{ companySubscriptions: number }> {
    return apiClient.get('companies/subscriptions/count').json();
  }
  static getMyFollowed() {
    return apiClient.get(`users/me/subscriptions/companies`).json<CompanySubscription[]>();
  }

  static getUserFollowed(userId: string) {
    return apiClient.get(`users/${userId}/subscriptions/companies`).json<CompanySubscription[]>();
  }

  static follow(id: string): Promise<Success> {
    return apiClient.post(`companies/${id}/subscribe`).json<Success>();
  }

  static unfollow(id: string): Promise<Success> {
    return apiClient.delete(`companies/${id}/unsubscribe`).json<Success>();
  }
  static verify(id: string) {
    return apiClient.post(`companies/${id}/onboarding-link`).json<UrlResponse>();
  }

  static openDashboard(id: string) {
    return apiClient.post(`companies/${id}/dashboard-link`).json<UrlResponse>();
  }

  static createPromoCode(id: string, dto: CompanyPromoCodeDto) {
    return apiClient.post(`companies/${id}/promo-code`, { json: dto }).json<CompanyPromoCodeDto>();
  }

  static getPromoCodes(id: string, page = 1) {
    const params = new URLSearchParams();
    params.set('page', page.toString());

    return apiClient
      .get(`companies/${id}/promo-code`, {
        searchParams: params
      })
      .json<Paginated<CompanyPromoCode>>();
  }

  static deletePromoCode(companyId: string, id: string) {
    return apiClient.delete(`companies/${companyId}/promo-code/${id}`);
  }
}
