import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Trash } from 'lucide-react';
import { type FC, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Pagination } from '@/shared/components/common/pagination';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { QueryKeys } from '@/shared/constants/query-keys';

import { type CompanyPromoCodeDto, CompanyPromoCodeSchema } from '../interfaces/company.interface';
import { CompanyService } from '../services/company.service';

interface Props {
  companyId: string;
}

export const CompanyPromoCode: FC<Props> = ({ companyId }) => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    reset
  } = useForm<CompanyPromoCodeDto>({
    resolver: zodResolver(CompanyPromoCodeSchema),
    mode: 'all'
  });

  const {
    data,
    isFetching,
    isLoading: isLoadingCodes
  } = useQuery({
    queryKey: [QueryKeys.COMPANY_PROMO_CODES, companyId, page],
    queryFn: () => CompanyService.getPromoCodes(companyId, page),
    enabled: !!companyId
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (dto: CompanyPromoCodeDto) => CompanyService.createPromoCode(companyId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.COMPANY_PROMO_CODES, companyId] });
      reset();
    }
  });

  const {
    mutate: deletePromoCode,
    isPending: isDeleting,
    variables
  } = useMutation({
    mutationFn: (id: string) => CompanyService.deletePromoCode(companyId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.COMPANY_PROMO_CODES, companyId] });
    }
  });

  const isLoading = isFetching || isPending;

  return (
    <div className="space-y-2">
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1">
          <Label htmlFor="discount">Discount (%)</Label>
          <Input
            {...register('discount', { valueAsNumber: true })}
            id="discount"
            errorMessage={!errors.discount?.message?.includes('Expected number') ? errors.discount?.message : undefined}
            type="number"
            step={1}
            min={1}
            max={100}
          />
        </div>
        <div className="grid gap-1">
          <Label htmlFor="maxUses">Max Uses</Label>
          <Input
            {...register('maxUses', { valueAsNumber: true })}
            id="maxUses"
            errorMessage={!errors.maxUses?.message?.includes('Expected number') ? errors.maxUses?.message : undefined}
            type="number"
            step={1}
            min={1}
            max={1000}
          />
        </div>

        <div className="sm:col-span-2">
          <Button type="submit" className="w-full sm:w-auto" disabled={!isValid || isLoading} isLoading={isPending}>
            Create Promo Code
          </Button>
        </div>
      </form>

      <ScrollArea className="h-60 w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Code</TableHead>
              <TableHead className="w-[100px]">Discount</TableHead>
              <TableHead>Uses</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingCodes && <TableSkeleton />}
            {data?.items.map((code) => (
              <TableRow key={code.id}>
                <TableCell className="font-medium">{code.code}</TableCell>
                <TableCell>{code.discount}%</TableCell>
                <TableCell>
                  {code.uses}/{code.maxUses}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deletePromoCode(code.id)}
                    disabled={isDeleting && variables === code.id}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {!isLoadingCodes && data?.items.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No codes found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>

      <Pagination
        totalPages={data?.meta.totalPages || 0}
        currentPage={data?.meta.currentPage || 1}
        onPageChange={(page) => setPage(page)}
      />
    </div>
  );

  function onSubmit(data: CompanyPromoCodeDto) {
    mutate(data);
  }
};

const TableSkeleton = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton className="h-[1rem]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-[1rem] w-[80px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-[1rem]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-[1rem] w-[40px]" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};
