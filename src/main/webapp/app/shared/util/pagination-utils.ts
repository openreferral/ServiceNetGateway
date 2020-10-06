import { getSortState, getUrlParameter } from 'react-jhipster';

export interface IPaginationBaseState {
  itemsPerPage: number;
  sort: string;
  order: string;
  activePage: number;
}

export const getSortStateWithPagination = (location, defaultItemsPerPage): IPaginationBaseState => {
  const sortState = getSortState(location, defaultItemsPerPage);
  const itemsPerPageParam = getUrlParameter('itemsPerPage', location.search);

  let itemsPerPage = defaultItemsPerPage;
  if (itemsPerPageParam !== '' && !isNaN(parseInt(itemsPerPageParam, 10))) {
    itemsPerPage = parseInt(itemsPerPageParam, 10);
  }

  return { ...sortState, itemsPerPage };
};
