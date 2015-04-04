import random
from sqlalchemy import func
from . import db
from models import *


def get_shuffled_id():
    print Pictures.query.count()
    num = db.session.query(func.max(Pictures.id))[0][0]
    print num
    # num = 10000
    piclist = [str(i+1) for i in range(num)]
    random.shuffle(piclist)
    # print piclist
    return ','.join(piclist)


def getpic(userid):
    user = User.query.filter_by(id=userid)[0]
    pool = str(user.picturepool).split(',')
    try:
        newidx = int(pool.pop(0))
        user.picturepool = ','.join(pool)
    except ValueError:
        return None
    # db.session.commit()
    # print 'the first is', newidx
    try:
        nextpic = Pictures.query.filter_by(id=newidx)[0].pic
        return nextpic
    except IndexError:
        return getpic(userid)

if __name__ == '__main__':
    for i in range(50):
        print getpic()
