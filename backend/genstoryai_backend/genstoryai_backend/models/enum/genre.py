from enum import Enum

class Genre(str, Enum):
    FANTASY = "fantasy"  # 奇幻
    SCIENCE_FICTION = "science_fiction"  # 科幻
    MYSTERY = "mystery"  # 悬疑
    ROMANCE = "romance"  # 浪漫爱情
    THRILLER = "thriller"  # 惊悚
    HORROR = "horror"  # 恐怖
    ADVENTURE = "adventure"  # 冒险
    HISTORICAL = "historical"  # 历史
    CONTEMPORARY = "contemporary"  # 现代