from enum import Enum


class RelationshipType(str, Enum):
    """角色关系类型"""
    FAMILY = "family"      # 家人
    FRIEND = "friend"      # 朋友
    ENEMY = "enemy"        # 敌人
    LOVER = "lover"        # 恋人
    MENTOR = "mentor"      # 导师
    STUDENT = "student"    # 学生
    COLLEAGUE = "colleague"  # 同事
    SERVANT = "servant"    # 主仆
    RIVAL = "rival"        # 对手 