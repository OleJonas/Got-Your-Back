
import numpy as np


    """
    Realtime collect sin metode collect_data er den som synkroniserer og henter ut data
    Den må etter å ha synkronisert bare stå og gå kontinuerlig (én tråd), samt legge data til buffer
    Så må vi ha en tråd som sover, og sjekker bufferet ved et gitt tidspunkt og predicter på det. Popper buffer
    """