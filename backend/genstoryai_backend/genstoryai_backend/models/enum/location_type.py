from enum import Enum


class LocationType(str, Enum):
    """地点类型枚举"""
    
    # 城市类
    CAPITAL = "capital"          # 首都
    CITY = "city"               # 城市
    TOWN = "town"               # 城镇
    VILLAGE = "village"         # 村庄
    SETTLEMENT = "settlement"    # 聚居地
    
    # 建筑类
    PALACE = "palace"           # 宫殿
    CASTLE = "castle"           # 城堡
    FORTRESS = "fortress"       # 要塞
    TEMPLE = "temple"           # 寺庙
    MONASTERY = "monastery"     # 修道院
    TAVERN = "tavern"           # 酒馆
    INN = "inn"                 # 客栈
    SHOP = "shop"               # 商店
    MARKET = "market"           # 市场
    WAREHOUSE = "warehouse"     # 仓库
    
    # 室内空间
    LIVING_ROOM = "living_room" # 客厅
    BATHROOM = "bathroom"       # 浴室
    KITCHEN = "kitchen"         # 厨房
    BEDROOM = "bedroom"         # 卧室
    STUDY = "study"             # 书房
    DINING_ROOM = "dining_room" # 餐厅
    
    # 自然地理
    FOREST = "forest"           # 森林
    MOUNTAIN = "mountain"       # 山脉
    HILL = "hill"               # 丘陵
    VALLEY = "valley"           # 山谷
    RIVER = "river"             # 河流
    LAKE = "lake"               # 湖泊
    OCEAN = "ocean"             # 海洋
    DESERT = "desert"           # 沙漠
    CAVE = "cave"               # 洞穴
    VOLCANO = "volcano"         # 火山
    BEACH = "beach"             # 海滩
    
    # 战场类
    BATTLEFIELD = "battlefield" # 战场
    CAMP = "camp"               # 军营
    OUTPOST = "outpost"         # 哨所
    BORDER = "border"           # 边境
    
    # 其他
    RUINS = "ruins"             # 废墟
    CEMETERY = "cemetery"       # 墓地
    GARDEN = "garden"           # 花园
    PARK = "park"               # 公园
    ROAD = "road"               # 道路
    BRIDGE = "bridge"           # 桥梁
    PORT = "port"               # 港口
    AIRPORT = "airport"         # 机场
    OTHER = "other"             # 其他
