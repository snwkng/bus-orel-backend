import { IncludedInThePriceDto } from '../dto/included-in-the-price-item.dto.js';
import { SelectItemDto } from '../dto/select-item.dto.js';

export const mapToSelectItem = (items: string[]): SelectItemDto[] => {
  return (items || []).map((item, index) => ({
    id: index + 1,
    name: item,
  }));
};

export const mapToIncludedInThePriceItem = (
  items: { serviceName: string; iconForService: string }[],
): IncludedInThePriceDto[] => {
  return (items || []).map((item, index) => ({
    id: index + 1,
    serviceName: item.serviceName,
    iconForService: item.iconForService,
  }));
};
