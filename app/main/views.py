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
    return redirect(url_for('auth.login'))


@main.route('/label', methods=['GET'])
def label():
    try:
        pic, idx, ttl = getpic(session.get('id'))
    except IndexError:
        session.clear()
        form = LoginForm()
        return redirect(url_for('auth.login'))

    if pic is None:
        session.clear()
        return render_template('end.html')
    print 'start by', pic
    return render_template('label.html', pic=pic, idx=idx, ttl=ttl)


@main.route('/newpic', methods=['GET'])
def newpic():
    pic, idx, ttl = getpic(session.get('id'))
    if pic is None:
        return render_template('end.html')
    print 'new', pic
    return jsonify({'pic': pic, 'idx': idx, 'ttl': ttl})


@main.route('/record/<pictureNum>/<label>/<duration>', methods=['POST'])
def data(pictureNum, label, duration):
    # session['id'] = random.randint(0, 50)
    print type(pictureNum), len(pictureNum)
    if len(pictureNum) < 13:
        print 'enter here'
        return render_template('end.html')

    now = datetime.now()
    labelTime = now.strftime("%Y%m%d-%H%M")
    value = 412
    attribute = 'pilot'
    
    userid = session.get('id')[0]
    user = User.query.filter_by(id=userid)[0]
    user.progress += 1
    data = Data(labelTime=labelTime, attribute=attribute, value=value,
                pictureNum=pictureNum, userid=userid, label=label, duration=duration)
    db.session.add(data)
    db.session.commit()

    return redirect(url_for('main.newpic'))
