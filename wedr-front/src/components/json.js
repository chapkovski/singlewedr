export const json = {
  "progressBarType": "pages",
  "showProgressBar": "top",
  "title": "Read dialogue on the left and answer the questions on the right.",  
  "pages": [
    {
      "name": "page1",
      "elements": [
        {
          "type": "radiogroup",
          "name": "compliance",
          "title": "Compliance? Did the participant(s) actually write something? ",
          "description":"(did **both** write something?)",
          "isRequired": true,
          "choices": ["Yes", "No"],
          "showOtherItem": true,
          "otherText": "Other:"
        }
      ]
    },
    {
      "name": "page2",
      "elements": [
        {
          "type": "radiogroup",
          "name": "scheming",
          "title": "Scheming? Did the participant explicitly agree with their partner ONLY to have a chance at winning the bonus?",
          "isRequired": true,
          "choices": ["Yes", "No", "Indeterminate (impossible to know based on the information available)"],
          "showOtherItem": true,
          "otherText": "Other:"
        }
      ]
    },
    {
      "name": "page3",
      "elements": [
        {
          "type": "radiogroup",
          "name": "rudeness",
          "title": "Rudeness? Was the participant dismissive of their partner, their partner's messages, or their partner's reasons, or rude in any other way?",
          "isRequired": true,
          "choices": ["Yes", "No", "Indeterminate (impossible to know based on the information available)"],
          "showOtherItem": true,
          "otherText": "Other:"
        }
      ]
    },
    {
      "name": "page4",
      "elements": [
        {   
          "displayMode": "buttons",
          "state": "expanded",
          "type": "rating",
          "name": "transactivity",
          "title": "Transactivity: Did the participant **build on** (not merely acknowledge) arguments for the alternative response?",
          "description":" (Example: 'Oh. If that's right, then...', but not just 'Oh. That might be right.')",
          "isRequired": true,
          "rateMin": 0,
          "rateMax": 5,
          "rateStep": 1,
          "minRateDescription": "No transitivity ",
          "maxRateDescription": "High transitivity"
        }
      ]
    },
    {
      "name": "page5",
      "elements": [
        {
          "type": "radiogroup",
          "name": "give_up_persuade",
          "title": "Did they give up trying to persuade their partner (i.e., agree to disagree)? ",
          "description":"They don't need to have used those exact words, but did they more or less give up on trying to convince one another?",
          "isRequired": true,
          "choices": ["Yes", "No", "Indeterminate (impossible to know based on the information available)"],
          "showOtherItem": true,
          "otherText": "Other:"
        }
      ]
    },
    {
      "name": "page6",
      "elements": [
        {
          "type": "radiogroup",
          "name": "familiarity",
          "title": "Did the participant report being familiar with the problem?",
          "description":" Example: 'I've seen this kind of problem many times in school, and I remember how it's always much lower than you would expect the answer to be.'",
          "isRequired": true,
          "choices": ["Yes", "No", "Indeterminate (impossible to know based on the information available)"],
          "showOtherItem": true,
          "otherText": "Other:"
        }
      ]
    },
    {
      "name": "page7",
      "elements": [
        {
          "type": "radiogroup",
          "name": "relevant",
          "title": "Did the participant write something relevant to the problem?",
          "description":" (Very occasionally people are completely off topic or seem not to understand what is going on. In those cases, the answer is no.)",
          "isRequired": true,
          "choices": ["Yes", "No", "Indeterminate (impossible to know based on the information available)"],
          "showOtherItem": true,
          "otherText": "Other:"
        }
      ]
    },
    {
      "name": "page8",
      "elements": [
        {
          "type": "radiogroup",
          "name": "ambivalence",
          "title": "Did the participant mention feeling conflicted between both responses?",
          "description":" E.g., 'I can see it both ways' or 'Both seem wrong' or 'Either one could make sense, I wasn't totally sure of my first answer,' etc.",
          "isRequired": true,
          "choices": ["Yes", "No", "Indeterminate (impossible to know based on the information available)"],
          "showOtherItem": true,
          "otherText": "Other:"
        }
      ]
    }
        
    
    
  ]
}
