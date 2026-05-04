
import os
import re

with open('conversion/RD3.0_standalone.tex', 'r') as f:
    raw_text = f.read()

# Split into preamble and body
doc_split = raw_text.split(r'\begin{document}')
preamble = doc_split[0]
body = doc_split[1].replace(r'\end{document}', '')

# Robustly remove \hypersetup{...}, \author{...}, \date{...}
preamble = re.sub(r'\\hypersetup\{([^{}]|\{[^{}]*\})*\}', '', preamble)
preamble = re.sub(r'\\author\{([^{}]|\{[^{}]*\})*\}', '', preamble)
preamble = re.sub(r'\\date\{([^{}]|\{[^{}]*\})*\}', '', preamble)

# Identify and remove original title block (from start to Revision History)
title_match = re.search(r'[\s\S]*?Revision History', body)
if title_match:
    body = "Revision History" + body[title_match.end():]

# TOC logic: Remove from TOC start to JUST BEFORE the Overview section
start_marker = r'\\hypertarget\{table-of-contents\}'
# Match the start of the overview hypertarget
overview_marker = r'\\hypertarget\{overview\}'

if re.search(start_marker, body) and re.search(overview_marker, body):
    # Replace from TOC start to just before the overview hypertarget
    body = re.sub(start_marker + r'[\s\S]*?(?=' + overview_marker + r')', r'\\tableofcontents\n\\newpage\n', body)

# Global replacements in body
body = body.replace('./conversion/', './')
body = body.replace(r'}\\', r'}')

# Fix navigation: Add \phantomsection before headers
# We'll also clean up pandoc's nested hypertargets which can cause duplication/misalignment
# Change \hypertarget{id}{\section{...}} to \phantomsection\section{...}\label{id}
def clean_sections(match):
    hid = match.group(1)
    content = match.group(2)
    # Check if content already has a label
    if r'\label{' in content:
        return r'\phantomsection ' + content
    else:
        return r'\phantomsection ' + content + r'\label{' + hid + r'}'

# Match \hypertarget{label}{\section/subsection...}
# Pandoc format: \hypertarget{id}{% \section{...}\label{id}}
body = re.sub(r'\\hypertarget\{([^{}]+)\}\{\s*%\s*(\\(?:sub)*section\{[^{}]+\}(?:\\label\{[^{}]+\})?)\}', clean_sections, body)

# For any remaining sections not wrapped in hypertarget
body = re.sub(r'(?<!\\phantomsection)(\\(?:sub)*section\{)', r'\\phantomsection\1', body)

def generate_tex(name, theme_preamble, title_block):
    full_text = preamble + theme_preamble + r"\begin{document}" + "\n" + title_block + "\n" + body + r"\end{document}"
    with open(f'conversion/{name}.tex', 'w') as f:
        f.write(full_text)

# Title Page Template
def get_title_page(title_color, text_color):
    return r"""
\begin{titlepage}
    \centering
    \thispagestyle{empty}
    \vspace*{2cm}
    
    {\Large\bfseries \color{""" + text_color + r"""} Group 11 Wicked Reality \par}
    \vspace{2cm}
    
    {\Huge\bfseries \color{""" + title_color + r"""} Requirements Documentation \par}
    \vspace{0.5cm}
    {\LARGE \color{""" + text_color + r"""} Wicked Reality (Group 9) \par}
    
    \vspace{2cm}
    {\Large \color{""" + text_color + r"""} Development Team: Group 11 \par}
    \vspace{1cm}
    
    {\large \color{""" + text_color + r"""} \textbf{Group Members}: \par}
    {\large \color{""" + text_color + r"""} Arika Khor, Cambren Williams, Ephraim Wong, \par}
    {\large \color{""" + text_color + r"""} Ethan Gulley, Jax Breedlove Donlon, Thuan Nguyen \par}
    
    \vfill
    {\large \color{""" + text_color + r"""} May 3, 2026 \par}
\end{titlepage}
\newpage
\setcounter{page}{1}
"""

# Common setup for headers/footers
common_fancy = r"""
\usepackage{fancyhdr}
\usepackage{lastpage}
\pagestyle{fancy}
\fancyhf{}
\lhead{Group 11 Wicked Reality}
\rfoot{Page \thepage\ of \pageref{LastPage}}
\renewcommand{\headrulewidth}{0.4pt}
\renewcommand{\footrulewidth}{0.4pt}
"""

dark_preamble = r"""
\usepackage[a4paper,margin=1in]{geometry}
\usepackage{xcolor}
\usepackage{pagecolor}
\usepackage{titlesec}
\usepackage{soul}
\usepackage[export]{adjustbox}
""" + common_fancy + r"""
\definecolor{darkbg}{HTML}{1E1E1E}
\definecolor{lighttext}{HTML}{D4D4D4}
\definecolor{titleorange}{HTML}{FF8C00}
\definecolor{subtitleblue}{HTML}{569CD6}

\pagecolor{darkbg}
\color{lighttext}

% Center all images globally
\makeatletter
\let\old@includegraphics\includegraphics
\renewcommand{\includegraphics}[2][]{\begin{center}\old@includegraphics[#1]{#2}\end{center}}
\makeatother

% Heading colors
\titleformat{\section}{\color{titleorange}\normalfont\Large\bfseries}{\thesection}{1em}{}
\titleformat{\subsection}{\color{subtitleblue}\normalfont\large\bfseries}{\thesubsection}{1em}{}
\titleformat{\subsubsection}{\color{lighttext}\normalfont\normalsize\bfseries}{\thesubsubsection}{1em}{}

\lhead{\color{lighttext}Group 11 Wicked Reality}
\rfoot{\color{lighttext}Page \thepage\ of \pageref{LastPage}}

\hypersetup{colorlinks=true, linkcolor=cyan, urlcolor=cyan}
"""

light_preamble = r"""
\usepackage[a4paper,margin=1in]{geometry}
\usepackage{xcolor}
\usepackage{pagecolor}
\usepackage{titlesec}
\usepackage{soul}
\usepackage[export]{adjustbox}
""" + common_fancy + r"""
\definecolor{lightbg}{HTML}{FFFFFF}
\definecolor{darktext}{HTML}{000000}

\pagecolor{lightbg}
\color{darktext}

% Center all images globally
\makeatletter
\let\old@includegraphics\includegraphics
\renewcommand{\includegraphics}[2][]{\begin{center}\old@includegraphics[#1]{#2}\end{center}}
\makeatother

\hypersetup{colorlinks=true, linkcolor=blue, urlcolor=blue}
"""

generate_tex('RD3.0_light', light_preamble, get_title_page('black', 'black'))
generate_tex('RD3.0_dark', dark_preamble, get_title_page('titleorange', 'lighttext'))
print("Fixed duplicate overview and cleaned section markers.")
