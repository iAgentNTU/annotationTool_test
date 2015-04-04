from flask import *
import random
from datetime import datetime
from . import main
from ..auth.forms import LoginForm
from .. import db
from ..models import Data, User
from ..util import *


@main.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html',
                           known=session.get('known'))


@main.route('/label', methods=['GET'])
def label():
    try:
        pic = getpic(session.get('id'))
    except IndexError:
        session.clear()
        form = LoginForm()
        return redirect(url_for('auth.login'))

    if pic is None:
        session.clear()
        return render_template('end.html')
    print 'start by', pic
    return render_template('label.html', pic=pic)


@main.route('/newpic', methods=['GET'])
def newpic():
    pic = getpic(session.get('id'))
    if pic is None:
        return render_template('end.html')
    print 'new', pic
    return jsonify({'pic': pic})


@main.route('/record/<pictureNum>/<value>/<label>', methods=['POST'])
def data(pictureNum, value, label):
    # session['id'] = random.randint(0, 50)
    print type(pictureNum), len(pictureNum)
    if len(pictureNum) < 13:
        print 'enter here'
        return render_template('end.html')

    now = datetime.now()
    labelTime = now.strftime("%Y%m%d-%H%M")
    attribute = 'num_people'
    userid = session.get('id')[0]
    data = Data(labelTime=labelTime, attribute=attribute, value=value,
                pictureNum=pictureNum, userid=userid, label=label)
    db.session.add(data)
    db.session.commit()

    return redirect(url_for('main.newpic'))
