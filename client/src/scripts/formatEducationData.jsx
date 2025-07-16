// ./client/src/scripts/formatEducationData.js

import React from 'react';
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import '../styles/customTimeline.css';

export function formatEducationData(educationEntries) {
  return (
    <div className="timeline-wrapper">
      <VerticalTimeline>
        {educationEntries.map((entry, idx) => (
          <VerticalTimelineElement
            key={`${entry.name}-${idx}`}
            date={`${entry.dateFrom || '?'} – ${entry.dateTo || 'Present'}`}
            contentStyle={{
              background: 'transparent',
              boxShadow: 'none',
              padding: 0,
            }}
            contentArrowStyle={{ display: 'none' }}
            iconStyle={{ background: '#F04B24', color: '#fff' }}
          >
            <div className="timeline-content-box">
              <h3 className="vertical-timeline-element-title">{entry.name}</h3>
              <h4 className="vertical-timeline-element-subtitle">
                {entry.degree}
              </h4>

              {entry.description?.length > 0 && (
                <ul style={{ paddingLeft: 20 }}>
                  {entry.description.map((item, i) => (
                    <li key={`${item}-${i}`}>
                      <span style={{ color: '#F04B24', fontWeight: 'bold', marginRight: 6 }}>•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>
    </div>
  );
}