// ./client/src/scripts/formatWorkData.jsx

import React from 'react';
import { Tag } from 'antd';
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import '../styles/customTimeline.css';

function getWorkTypeColor(workType) {
  const normalized = (workType || '').toLowerCase();
  if (normalized.includes('full-time') || normalized.includes('full time')) {
    return 'green';
  }
  if (normalized.includes('part-time') || normalized.includes('part time')) {
    return 'blue';
  }
  if (normalized.includes('intern')) {
    return 'purple';
  }
  if (normalized.includes('casual')) {
    return 'orange';
  }
  if (normalized.includes('contract')) {
    return 'cyan';
  }
  return 'default';
}

export function formatWorkData(workEntries) {
  return (
    <div className="timeline-wrapper">
      <VerticalTimeline>
        {workEntries.map((entry, idx) => (
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
              <div className="vertical-timeline-role-wrapper">
                <h4 className="vertical-timeline-element-subtitle">
                  {entry.position}
                </h4>
                {entry.workType && (
                  <Tag className="work-type-tag" color={getWorkTypeColor(entry.workType)}>
                    {entry.workType}
                  </Tag>
                )}
              </div>

              {entry.description?.length > 0 && (
                <ul>
                  {entry.description.map((item) => (
                    <li key={item}>{item}</li>
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