
import React from 'react';

// CUSTOMIZATION: Timeline Events
// Modify the array below to change the timeline events
// Each event has: time, title, and description
const timelineEvents = [
  { time: "11:30 AM", title: "Brainstorming Breakfasts", description: "Start your day with engaging discussions" },
  { time: "1:00 PM", title: "Team Activity Afternoons", description: "Collaborative sessions and workshops" },
  { time: "6:00 PM", title: "Simulation Sunsets", description: "Apply learnings in practical scenarios" },
  { time: "12:00 AM", title: "Midnight Momentum", description: "Deep conversations and connections" },
];

const TimelineSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        {/* CUSTOMIZATION: Timeline Section Title */}
        <h2 className="text-3xl md:text-4xl font-playfair text-navy mb-4">A Day in the Villa</h2>
        
        {/* CUSTOMIZATION: Timeline Section Description */}
        <p className="text-lg text-gray-600 mb-12 max-w-3xl">
          We create the perfect conditions for you to have the most insightful conversations, amazing memories and take action towards your goals
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {timelineEvents.map((event, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg">
              <div className="text-terracotta font-mono mb-2">{event.time}</div>
              <h3 className="font-medium text-navy mb-2">{event.title}</h3>
              <p className="text-gray-600 text-sm">{event.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
