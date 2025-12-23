package main

import (
	"testing"
)

// 腾讯成都部门面试

//  题目一：最长无重复字符子串
// 2.1 题目描述
// 给定一个字符串 s，请你找出其中不含有重复字符的最长子串的长度。

// 2.2 示例
// 输入	输出	解释
// s = "abcabcbb"	3	最长子串是 "abc"，长度为 3
// s = "bbbbb"	1	最长子串是 "b"，长度为 1
// s = "pwwkew"	3	最长子串是 "wke"，长度为 3
// s = ""	0	空字符串，长度为 0
// 约束条件：

// 0 <= s.length <= 5 * 10^4
// s 由英文字母、数字、符号和空格组成

func SubString(s string) int {

	if len(s) == 0 {
		return 0
	}

	maxLen := 1
	sMap := make(map[byte]int)

	left := 0
	for right := 0; right < len(s); right++ {

		currentChart := s[right]
		if idx, ok := sMap[currentChart]; ok && idx >= left {
			left = idx + 1
		}
		sMap[currentChart] = right

		maxLen = max(maxLen, right-left+1)

	}

	return maxLen
}

func TestSubString(t *testing.T) {

	testCases := []struct {
		input    string
		expected int
	}{
		{"abcabcbb", 3},
		{"bbbbb", 1},
		{"pwwkew", 3},
		{"", 0},
		{"au", 2},
		{"dvdf", 3},
	}
	// 测试用例
	t.Run("TestSubString", func(t *testing.T) {
		for _, tc := range testCases {
			actual := SubString(tc.input)
			if actual != tc.expected {
				t.Errorf("subString(%q) = %d, expected %d", tc.input, actual, tc.expected)
			}
		}
	})
}
