// ./client/src/scripts/formatWorkData.jsx

import React from 'react';
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import '../styles/customTimeline.css';

export function formatWorkData(workEntries) {
  return (
    <VerticalTimeline>
      {workEntries.map((entry, idx) => (
        <VerticalTimelineElement
          key={`${entry.name}-${idx}`}   
          date={`${entry.dateFrom || '?'} – ${entry.dateTo || 'Present'}`}
          contentStyle={{ background: 'white', color: '#333' }}
          contentArrowStyle={{ borderRight: '7px solid #F04B24' }}
          iconStyle={{ background: '#F04B24', color: '#fff' }}
        >
          <h3 className="vertical-timeline-element-title">{entry.name}</h3>
          <h4 className="vertical-timeline-element-subtitle">
            {entry.position}
          </h4>

          {entry.description?.length > 0 && (
            <ul>
              {entry.description.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </VerticalTimelineElement>
      ))}
    </VerticalTimeline>
  );
}