from otree.api import (
    models,
    widgets,
    BaseConstants,
    BaseSubsession,
    BaseGroup,
    BasePlayer,
    Currency as c,
    currency_range,
)
from django.db import models as djmodels
from random import choices, sample
import random
import emojis
import json
import logging
from collections import OrderedDict
from datetime import datetime

# let's import cycle

logger = logging.getLogger(__name__)


# TODO:
# 1. progrfess bar
# 2. insert page with instructions
# 3. popup button at the working page
# 4. popup confirming success when the word is submitted correctly



def is_single_scalar(emoji):
    # Normalize the emoji to its fully decomposed form
    decomposed = emoji.encode('unicode-escape').decode('ASCII')
    # If it contains '\u200d' (Zero Width Joiner), it's a composite emoji
    return '\\u200d' not in decomposed


def get_unicode_codepoints(emoji):
    # Return a tuple of Unicode code points for a given emoji
    return tuple(ord(char) for char in emoji)


def select_emojis(emojis, number_to_select, min_distance):
    selected_emojis = []
    # Sort emojis by their combined code points values
    sorted_emojis = sorted(emojis, key=get_unicode_codepoints)

    while len(selected_emojis) < number_to_select:
        # Randomly select an emoji from the sorted list
        emoji = random.choice(sorted_emojis)
        emoji_codepoints = get_unicode_codepoints(emoji)

        # Check if the emoji is at a minimum distance from all previously selected emojis
        if all(min(abs(a - b) for a in emoji_codepoints for b in get_unicode_codepoints(e)) >= min_distance for e in
               selected_emojis):
            selected_emojis.append(emoji)
            # Remove a range of emojis around the selected one to maintain the distance
            sorted_emojis = [e for e in sorted_emojis if min(
                abs(a - b) for a in get_unicode_codepoints(e) for b in emoji_codepoints) >= min_distance]

        # If we've removed too many and can't select enough, reduce the distance
        if len(sorted_emojis) < number_to_select - len(selected_emojis):
            logger.warning("Not enough emojis to maintain the minimum distance. Reducing distance.")
            return select_emojis(emojis, number_to_select, min_distance - 1)

    return selected_emojis


def encode_word_with_alphabet(word):
    # List of example emojis categorized under 'People & Body' for demonstration
    all_emojis = emojis.db.utils.db.EMOJI_DB
    allowed_categories = ['People & Body', 'Animals & Nature', 'Food & Drink', 'Travel & Places', 'Activities', ]
    allowed_emojis = [i.emoji for i in all_emojis if i.category in allowed_categories]

    allowed_emojis = [i for i in allowed_emojis if is_single_scalar(i)]

    # Create a mapping between alphabets and a random set of emojis
    alphabet = 'abcdefghijklmnopqrstuvwxyz'
    selected_emojis = select_emojis(allowed_emojis, len(alphabet), 10)
    alphabet_to_emoji = dict(zip(alphabet, selected_emojis))

    # Encode the word
    encoded_word = [alphabet_to_emoji.get(letter, letter) for letter in word]
    return {'encoded_word': encoded_word, 'alphabet_to_emoji': alphabet_to_emoji}


author = 'Philipp Chapkovski, UDuisburg, chapkovski@gmail.com'

doc = """
Your app description
"""



class Constants(BaseConstants):
    name_in_url = 'wedr'
    players_per_group = None
    # we need to read words from data/words.txt
    with open('data/words.csv', 'r') as f:
        words = [i.strip() for i in f.readlines()]

    num_rounds = 1

    time_for_work = 120


class Subsession(BaseSubsession):
    pass


class Group(BaseGroup):
    pass


class Player(BasePlayer):
    def get_uncompleted_task(self):

        unclosed_task =  self.tasks.filter(solved=False).first()
        if unclosed_task:
            return unclosed_task
        else:
            return self.create_new_task()
    def create_new_task(self):
        decoded_word = random.choice(Constants.words)
        res = encode_word_with_alphabet(decoded_word)
        alphabet_to_emoji = json.dumps(res['alphabet_to_emoji'])
        encoded_word = json.dumps(res['encoded_word'])
        task = Task.objects.create(
            utc_time=datetime.utcnow(),
            owner=self,
            answer=decoded_word,
            dictionary=alphabet_to_emoji,
            word=decoded_word,
            encoded_word=encoded_word
        )
        logger.critical(f'new word: {task.word} ')
        return task

    def handle_completed(self, data):
        logger.info(f'Got completion {data}')
        word = data.get('decodedWord')
        task = self.tasks.filter(solved=False).first()
        if task.answer == word:
            task.solved = True
            task.save()
        else:
            return dict(type='new_task', data=task.to_dict())
        new_task = self.create_new_task()
        new_task_data= new_task.to_dict()
        new_task_data['completed_tasks'] = self.tasks.filter(solved=True).count()
        return {'type': 'new_task',
                'data': new_task_data}

    def process_data(player, data):
        logger.info(f"Got data: {data}")
        type = data.get('type')
        data = data.get('data')
        if type == 'completed':
            return {player.id_in_group: player.handle_completed(data)}


class Task(djmodels.Model):
    utc_time = djmodels.DateTimeField()
    owner = djmodels.ForeignKey(to=Player, on_delete=djmodels.CASCADE, related_name='tasks')
    answer = models.StringField()
    dictionary = models.StringField()
    word = models.StringField()
    encoded_word = models.StringField()
    solved = models.BooleanField(default=False)

    def to_dict(self):
        return {'owner': self.owner.id_in_group,
                'word': self.word,
                'encoded_word': json.loads(self.encoded_word),
                'dictionary': json.loads(self.dictionary), }
