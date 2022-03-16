from .functions import connected_to_internet
from .models import ConnectToServer
from .database import ShiftSQL , ReciptsSQL
from playstation import db

def GetReports():
    Sshifts = list(ShiftSQL.query.all())
    ShiftObj = Sshifts[len(Sshifts) - 1]
    lastShift = ShiftObj.__dict__
    rlist = list(db.session.query(ReciptsSQL).filter(ReciptsSQL.shiftNumber == lastShift['id'] ))
    r = []
    for rl in rlist :
        r.append(rl.__dict__)
    return r


def GetReport(id) :
    r = db.session.query(ReciptsSQL).get(id)
    return r.__dict__


