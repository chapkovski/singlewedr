from otree.api import Currency as c, currency_range
from ._builtin import Page, WaitPage
from .models import Constants, encode_word_with_alphabet
import emojis
import logging
import json
from datetime import timedelta, datetime, timezone

logger = logging.getLogger(__name__)


class WorkingPage(Page):
    live_method = 'process_data'

    def js_vars(self):
        time_to_go = self.participant.vars.setdefault('time_to_go', (
                datetime.now(timezone.utc) + timedelta(seconds=Constants.time_for_work)).timestamp())
        remaining_time = time_to_go - datetime.now(timezone.utc).timestamp()
        current_task = self.player.get_uncompleted_task()

        return dict(
            remaining_time=remaining_time,
            completed_tasks= self.player.tasks.filter(solved=True).count(),
            **current_task.to_dict()
        )



class PartnerWP(WaitPage):
    pass


page_sequence = [

    WorkingPage,
]
