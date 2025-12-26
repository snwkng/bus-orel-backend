import { SelectItemDto } from '../dto/select-item.dto';

export const mapToSelectItem = (items: string[]): SelectItemDto[] => {
  return (items || []).map((item, index) => ({
    id: index + 1,
    name: item,
  }));
};