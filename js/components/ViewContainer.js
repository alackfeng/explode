import React, { Component } from 'react';
import styled from 'styled-components/native';

import { Colors } from '../libs/Colors';


type Props = {
  children?: React.Element<*>,
};

const Container = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  background-color: #F8F9FC;
`;

export const ViewContainer = ({ children }: Props) => (
  <Container>{children}</Container>
);

ViewContainer.defaultProps = {
  children: null,
};
