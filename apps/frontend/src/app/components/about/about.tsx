import React, { useState } from 'react';
import { Text, Item, ListBox, TabList, TabPanels, Tabs, Content } from '@adobe/react-spectrum';
import Rules from './rules';

export const About = () => {
  return (
    <Tabs aria-label="About Categories">
      <TabList>
        <Item key="idea">Idea</Item>
        <Item key="rules">Rules</Item>
        <Item key="changelog">Changelog</Item>
        <Item key="tech">Tech Stack</Item>
      </TabList>
      <TabPanels>
        <Item key="idea">
          <Text>
            This MMO browser game is esentially an agent-based model turned into a game, by giving the player control over some of the agents.
          </Text>
          <Text>
            An agent-based model (ABM) is a relatively new form of modeling used by economists. In constrast to classic models, an ABM cannot be solved. It leverages object oriented programming to construct an economy from the bottom up. Economic agents (consumers, producers, the central bank, etc.) are programmed as classes that describe the rules for the behavior of the agent.
          </Text>
          <Text>
            When the model is ran, every consumer buys goods as defined by the rules for consumers, and every firm produces goods as defined by the rules for firms, and so on.
          </Text>
        </Item>
        <Item key="rules">
          <Rules />
        </Item>
        <Item key="changelog">
          Nothing new
        </Item>
        <Item key="tech">
          <ListBox aria-label="Alignment">
            <Item>Frontend: React</Item>
            <Item>UI Components: Adobe Spectrum</Item>
            <Item>API: GraphQL</Item>
            <Item>Backend: Nestjs</Item>
            <Item>Database: MySql</Item>
          </ListBox>
        </Item>
      </TabPanels>
    </Tabs>
  );
};

export default About;
