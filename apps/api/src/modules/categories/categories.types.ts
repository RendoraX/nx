//=====================DTO'S=====================//
export interface createCategoryDTO{
    name : string;
    slug : string;
    parentId ?: string;
};

export interface updateCategoryDTO{
    id : string
    name ?: string;
    slug ?: string;
    parentId ?: string;
};

export interface deleteCategoryDTO{
    id   : string;
};

//=====================Categories types=====================//