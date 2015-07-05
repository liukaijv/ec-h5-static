// 测试数据

//商品
var products = [
    {
        "productid": "1",
        "productname": "甜美小蝴蝶结印花连衣裙",
        "mktprice": "99.00",
        "productpic": "http://img06.taobaocdn.com/bao/uploaded/i6/T1LXOgXmhlXXXO03fa_120859.jpg"
    },
    {
        "productid": "2",
        "productname": "明星气质印花连衣裙",
        "mktprice": "99.00",
        "productpic": "http://img03.taobaocdn.com/bao/uploaded/i3/T1s9CfXmXwXXc95Mra_120910.jpg"
    },
    {
        "productid": "3",
        "productname": "清新浪漫大印花连衣裙",
        "mktprice": "99.00",
        "productpic": "http://img04.taobaocdn.com/bao/uploaded/i4/T1OROfXlxyXXX6Y1ja_120630.jpg"
    },
    {
        "productid": "4",
        "productname": "质朴田园风格纹半裙",
        "mktprice": "59.00",
        "productpic": "http://img02.taobaocdn.com/bao/uploaded/i2/T1tsugXkVmXXcxUrQ5_054816.jpg"
    },
    {
        "productid": "5",
        "productname": "百搭牛仔短裙W011",
        "mktprice": "69.00",
        "productpic": "http://img07.taobaocdn.com/bao/uploaded/i7/T1XcmiXjdfXXXiOhbb_093928.jpg"
    },
    {
        "productid": "6",
        "productname": "爱心印花百褶半裙",
        "mktprice": "69.00",
        "productpic": "http://img06.taobaocdn.com/bao/uploaded/i6/T1bdyhXa8nXXXkpSs5_060049.jpg"
    },
    {
        "productid": "7",
        "productname": "甜美少女蓬蓬半裙",
        "mktprice": "59.00",
        "productpic": "http://img02.taobaocdn.com/bao/uploaded/i2/T13_SfXiFtXXXSCRrX_115905.jpg"
    },
    {
        "productid": "8",
        "productname": "时尚牛仔连衣裙W004",
        "mktprice": "149.00",
        "productpic": "http://img07.taobaocdn.com/bao/uploaded/i7/T1LK5iXe0eXXc6IcU7_063823.jpg"
    },
    {
        "productid": "9",
        "productname": "百搭牛仔短裙W001",
        "mktprice": "99.00",
        "productpic": "http://img01.taobaocdn.com/bao/uploaded/i1/T1SNOhXiXaXXaVhCM5_060107.jpg"
    },
    {
        "productid": "2696",
        "productname": "Romance 雪纺针织连衣裙",
        "mktprice": "99.00",
        "productpic": "http://img07.taobaocdn.com/bao/uploaded/i7/T132agXdBpXXb5t478_071021.jpg_80x80.jpg"
    },
    {
        "productid": "2697",
        "productname": "Marines 塑腰连衣裙",
        "mktprice": "89.00",
        "productpic": "http://img06.taobaocdn.com/bao/uploaded/i6/T1lmGfXghvXXc5mVg9_101928.jpg_80x80.jpg"
    },
    {
        "productid": "2698",
        "productname": "princesse 蕾丝短裙",
        "mktprice": "89.00",
        "productpic": "http://img07.taobaocdn.com/bao/uploaded/i7/T1dUifXnxsXXcbV2Db_123729.jpg_80x80.jpg"
    },
    {
        "productid": "2699",
        "productname": "Cowgirl 蕾丝牛仔短裙",
        "mktprice": "99.00",
        "productpic": "http://img04.taobaocdn.com/bao/uploaded/i4/T1qBGgXfppXXXX_R3T_012708.jpg_80x80.jpg"
    },
    {
        "productid": "2700",
        "productname": "Cowgirl heart stitching牛仔短裙",
        "mktprice": "89.00",
        "productpic": "http://img03.taobaocdn.com/bao/uploaded/i3/T12HigXaXqXXbHEcs5_054902.jpg_80x80.jpg"
    },
    {
        "productid": "2701",
        "productname": "OL风收腰印花连衣裙",
        "mktprice": "79.00",
        "productpic": "http://img08.taobaocdn.com/bao/uploaded/i8/T1goKfXaRrXXcqtZza_120408.jpg_80x80.jpg"
    },
    {
        "productid": "2702",
        "productname": "亮钻装饰吊带连衣裙",
        "mktprice": "79.00",
        "productpic": "http://img05.taobaocdn.com/bao/uploaded/i5/T1dZKjXXprXXbR0r35_054834.jpg_80x80.jpg"
    },
    {
        "productid": "2703",
        "productname": "撞色拼接印花连衣裙",
        "mktprice": "69.00",
        "productpic": "http://img04.taobaocdn.com/bao/uploaded/i4/T1xrmgXcJbXXXyBWna_120125.jpg_80x80.jpg"
    },
    {
        "productid": "2704",
        "productname": "撞色衬衫连衣裙",
        "mktprice": "99.00",
        "productpic": "http://img05.taobaocdn.com/bao/uploaded/i5/T15xigXdBtXXXm1DZW_025051.jpg_80x80.jpg"
    },
    {
        "productid": "2705",
        "productname": "白色后拉链三层蛋糕半裙",
        "mktprice": "59.00",
        "productpic": "http://img06.taobaocdn.com/bao/uploaded/i6/T1upKgXblqXXbjnHQ5_054814.jpg_80x80.jpg"
    },
    {
        "productid": "2706",
        "productname": "灯笼袖衬衫式连衣裙",
        "mktprice": "99.00",
        "productpic": "http://img05.taobaocdn.com/bao/uploaded/i5/T1PSCfXkXwXXXH4Fza_120025.jpg_80x80.jpg"
    },
    {
        "productid": "2707",
        "productname": "浪漫印花纯棉吊带连衣裙",
        "mktprice": "99.00",
        "productpic": "http://img08.taobaocdn.com/bao/uploaded/i8/T1kpWgXiRjXXbXxhA8_100645.jpg_80x80.jpg"
    },
    {
        "productid": "2708",
        "productname": "News Paper 印花连衣裙",
        "mktprice": "79.00",
        "productpic": "http://img06.taobaocdn.com/bao/uploaded/i6/T1w6dmXj0wXXX0UsUU_013859.jpg_80x80.jpg"
    },
    {
        "productid": "2709",
        "productname": "三层插肩飞袖连衣裙",
        "mktprice": "129.00",
        "productpic": "http://img07.taobaocdn.com/bao/uploaded/i7/T1EY1gXdRXXXbDgqba_120106.jpg_80x80.jpg"
    },
    {
        "productid": "2710",
        "productname": "碎花抽褶花边连衣裙",
        "mktprice": "89.00",
        "productpic": "http://img05.taobaocdn.com/bao/uploaded/i5/T1989fXbFyXXXqGHYb_122949.jpg_80x80.jpg"
    }  
];

// 限时商品
var limitProducts = [];

// 团购商品
var groupProducts = [];

// 活动商品
var activityProducts = [];

// 商品分类
var productCategories = [];

// 文章
var articles = [];

// 文章分类
var articleCategories = [];

// 图片
var images = [];

// 品牌
var brands = [   
    {
        "brandid": 13,
        "brandname": "杰克琼斯",
        "brandlogo": "" 
    },
    {
        "brandid": 14,
        "brandname": "阿迪达斯",
        "brandlogo": ""
    },
    {
        "brandid": 15,
        "brandname": "爱慕",
        "brandlogo": ""
    },
    {
        "brandid": 16,
        "brandname": "爱世克斯",
        "brandlogo": ""
    },
    {
        "brandid": 17,
        "brandname": "鸿星尔克",      
        "brandlogo": ""
    },
    {
        "brandid": 18,
        "brandname": "佐丹奴",     
        "brandlogo": ""
    },
    {
        "brandid": 19,
        "brandname": "歌莉娅",        
        "brandlogo": ""      
    },
    {
        "brandid": 20,
        "brandname": "九牧王",   
        "brandlogo": ""     
    },
    {
        "brandid": 21,
        "brandname": "卡帕",        
        "brandlogo": ""      
    },
    {
        "brandid": 22,
        "brandname": "劲霸",       
        "brandlogo": ""      
    },
    {
        "brandid": 23,
        "brandname": "李宁",       
        "brandlogo": ""     
    },
    {
        "brandid": 24,
        "brandname": "耐克",        
        "brandlogo": ""       
    },
    {
        "brandid": 25,
        "brandname": "欧时力",       
        "brandlogo": ""      
    },
    {
        "brandid": 26,
        "brandname": "淑女屋1",        
        "brandlogo": ""       
    }
];