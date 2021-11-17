package main

import (
	"fmt"
)

func main() {
	var input string

	fmt.Scan(&input)
	fmt.Println(Greeting(input))
}

func Greeting(target string) string {
	return "Hello " + target + "!"
}