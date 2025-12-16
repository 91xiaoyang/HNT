export type Disk = {
  id: number;
  size: number;
  color: string;
};

export type Tower = Disk[];

export type Move = {
  from: number;
  to: number;
};

export type CodeStep = {
  line: number;
  stackDepth: number;
  description: string;
  args?: {
    n: number;
    from: string;
    aux: string;
    to: string;
  };
};
