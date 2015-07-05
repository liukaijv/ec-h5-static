var baseUrl = '';

// 得到商品
$.mockjax({
  url: baseUrl + '/getProducts',   
  responseText: products
});

// 得到分类
$.mockjax({
  url: baseUrl + '/getProductCategories',
  responseText: products
});

$.mockjax({
  url: baseUrl + '/getBrands',
  responseText: brands
});