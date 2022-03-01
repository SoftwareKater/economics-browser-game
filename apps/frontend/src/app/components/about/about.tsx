import React, { useState } from 'react';
import { Content, Heading, Item, TabList, TabPanels, Tabs } from '@adobe/react-spectrum';
import Rules from './rules';

export const About = () => {
  return (
    <Tabs aria-label="History of Ancient Rome">
      <TabList>
        <Item key="idea">Idea</Item>
        <Item key="rules">Rules</Item>
        <Item key="tech">Tech</Item>
      </TabList>
      <TabPanels>
        <Item key="idea">

          This MMO browser game is esentially an agent-based model turned into a game, by giving the player control over some of the agents.

          An agent-based model (ABM) is a relatively new form of modeling used by economists. In constrast to classic models, an ABM cannot be solved. It leverages object oriented programming to construct an economy from the bottom up. Economic agents (consumers, producers, the central bank, etc.) are programmed as classes that describe the rules for the behavior of the agent.

          When the model is ran, every consumer buys goods as defined by the rules for consumers, and every firm produces goods as defined by the rules for firms, and so on.
        </Item>
        <Item key="rules">
          <Rules />
        </Item>
        <Item key="Tech">
          - React Frontend
          - Nestjs Backend
          - API: GraphQL
          - Adobe Spectrum Webcomponents
        </Item>
      </TabPanels>
    </Tabs>
  );
};

export default About;
